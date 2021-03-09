import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import times from "lodash/times";
import assign from "lodash/assign";
import Bluebird from "bluebird";
import { getAddress } from "@harmony-js/crypto";
import ArtCollectibleToken from "../contracts/ArtCollectibleToken.json";

export const Web3Info = (props) => {
  const { web3Context } = props;
  const { networkId, networkName, accounts, providerName, lib } = web3Context;

  const [balance, setBalance] = useState(0);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [collectibleTokenIds, setCollectibleTokenIds] = useState([]);

  // Get the address's balance
  const getOneBalance = useCallback(async () => {
    const balance =
      accounts && accounts.length > 0
        ? lib.utils.fromWei(await lib.eth.getBalance(accounts[0]), "ether")
        : "Unknown";
    setBalance(balance);
  }, [accounts, lib.eth, lib.utils]);

  // gets total balance of One tokens
  useEffect(() => {
    getOneBalance();
  }, [accounts, getOneBalance, networkId]);

  // Get our collectible contract based on the approved connection
  const contract = useMemo(() => {
    if (lib?.eth?.Contract) {
      return new lib.eth.Contract(
        ArtCollectibleToken.abi,
        "0x704C4e00efaC241e6047bb5Bc525751a7d51B88f"
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
    if (contract && accounts && accounts.length) {
      getTokenBalance();
    }
  }, [contract, accounts]);

  // get the token ids by index of the address
  useEffect(() => {
    async function getCollectibleTokenIds() {
      const tokens: any = [];
      // for (let i = 0; i < tokenBalance; i++) {
      await times(tokenBalance, async (i) => {
        const token = await contract.methods
          .tokenOfOwnerByIndex(accounts[0], i)
          .call();
        tokens.push(token);
      });
      setCollectibleTokenIds(tokens);
    }
    if (tokenBalance) {
      getCollectibleTokenIds();
    }
  }, [tokenBalance]);

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
          console.log(tokenIdAndURI);
          const metadata = await axios
            .get(tokenIdAndURI.tokenURI)
            .then(({ data }) => data);
          return assign({}, tokenIdAndURI, { metadata });
        }
      );
      console.log(tokensAndMetadata);
    }
    if (collectibleTokenIds.length) {
      getCollectibleTokenMetadata();
    }
  }, [collectibleTokenIds]);

  const requestAuth = async (web3Context) => {
    try {
      await web3Context.requestAuth();
    } catch (e) {
      console.error(e);
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
          <button onClick={requestAccess}>Request Access</button>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};
