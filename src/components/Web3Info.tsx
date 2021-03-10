import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import Bluebird from "bluebird";
import { getAddress } from "@harmony-js/crypto";
import ArtCollectibleToken from "../contracts/ArtCollectibleToken.json";

const { REACT_APP_COLLECTIBLE_CONTRACT } = process.env;

export const Web3Info = (props) => {
  const { web3Context } = props;
  const { networkId, networkName, accounts, providerName, lib } = web3Context;

  const [balance, setBalance] = useState(0);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [collectibleTokenIds, setCollectibleTokenIds] = useState([]);
  const [collectibleTokens, setCollectibleTokens] = useState<any[]>([]);

  // gets total balance of One tokens as account address
  useEffect(() => {
    async function getOneBalance() {
      const balance =
        accounts && accounts.length > 0
          ? lib.utils.fromWei(await lib.eth.getBalance(accounts[0]), "ether")
          : "Unknown";
      setBalance(balance);
    }
    getOneBalance().then(() => Promise.resolve());
  }, [accounts, lib]);

  // Get our collectible contract based on the approved connection
  const contract = useMemo(() => {
    if (lib?.eth?.Contract) {
      return new lib.eth.Contract(
        ArtCollectibleToken.abi,
        REACT_APP_COLLECTIBLE_CONTRACT
      );
    }
    return null;
  }, [lib.eth]);

  // get the token balance of the address's tokens
  useEffect(() => {
    async function getTokenBalance() {
      const collectionBalance = await contract.methods
        .balanceOf(accounts[0])
        .call();
      setTokenBalance(collectionBalance);
    }
    if (contract && accounts && accounts?.length) {
      getTokenBalance().then(() => Promise.resolve());
    }
  }, [contract, accounts]);

  // get the token ids by index of owned NFT of the address
  useEffect(() => {
    async function getCollectibleTokenIds() {
      // create an empty array with length just
      // to take advantage of bluebird
      const tokens = await Bluebird.mapSeries(new Array(tokenBalance), (v, i) =>
        contract.methods.tokenOfOwnerByIndex(accounts[0], i).call()
      );
      setCollectibleTokenIds(tokens);
    }
    if (tokenBalance && accounts?.length) {
      getCollectibleTokenIds().then(() => Promise.resolve());
    }
  }, [tokenBalance, accounts]);

  // gets the NFT metadata of the owner's tokens
  useEffect(() => {
    async function getCollectibleTokenMetadata() {
      const tokensIdAndURI = await Bluebird.map(
        collectibleTokenIds,
        async (tokenId) => {
          const tokenURI = await contract.methods.tokenURI(tokenId).call();
          return { tokenId, tokenURI };
        },
        { concurrency: 2 }
      );
      // annotate with the metadata
      const tokensAndMetadata = await Bluebird.map(
        tokensIdAndURI,
        async (tokenIdAndURI) => {
          const metadata = await axios
            .get(tokenIdAndURI.tokenURI)
            .then(({ data }) => data);
          return { ...tokenIdAndURI, metadata: { ...metadata } };
        }
      );
      setCollectibleTokens(tokensAndMetadata);
    }
    if (collectibleTokenIds.length) {
      getCollectibleTokenMetadata().then(() => Promise.resolve());
    }
  }, [collectibleTokenIds]);

  const requestAuth = async (web3Context) => {
    try {
      await web3Context.requestAuth();
    } catch (e) {
      // console.error(e);
    }
  };

  const requestAccess = useCallback(() => requestAuth(web3Context), []);

  return (
    <div>
      <h3> {props.title} </h3>
      <div>
        Network: {networkId ? `${networkId} – ${networkName}` : "No connection"}
      </div>
      <div>
        Your address:{" "}
        {accounts && accounts.length
          ? getAddress(accounts[0]).bech32
          : "Unknown"}
      </div>
      <div>Your ETH balance: {balance}</div>
      <div>Provider: {providerName}</div>
      {accounts && accounts.length ? (
        <div>Accounts & Signing Status: Access Granted</div>
      ) : !!networkId && providerName !== "infura" ? (
        <div>
          <button type="submit" onClick={requestAccess}>
            Request Access
          </button>
        </div>
      ) : (
        <div />
      )}
      <div>Total of {tokenBalance} NFTs</div>
      <div>
        {collectibleTokens.length &&
          collectibleTokens.map((token) => {
            return (
              <img
                key={token.metadata.title}
                src={token.metadata.image}
                alt={token.metadata.title}
              />
            );
          })}
      </div>
    </div>
  );
};
