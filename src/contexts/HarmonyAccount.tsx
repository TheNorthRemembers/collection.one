import React, {
  createContext,
  useEffect,
  useMemo,
  useState,
  PropsWithChildren,
} from "react";
import Web3Context from "@openzeppelin/network/lib/context/Web3Context";
import { Contract } from "web3-eth-contract";

import axios from "axios";
import Bluebird from "bluebird";
import { getAddress } from "@harmony-js/crypto";
import ArtCollectibleToken from "../contracts/ArtCollectibleToken.json";

const { REACT_APP_COLLECTIBLE_CONTRACT } = process.env;

export interface CollectibleToken {
  tokenId: number;
  tokenUri: string;
  metadata: {
    image: string;
    name: string;
    description: string;
    [key: string]: string;
  };
}

export interface HarmonyAccount {
  web3Context: Web3Context | null;
  contract: Contract | null;
  harmonyOneBalance: string;
  harmonyOneAddress: string;
  tokenBalance: number;
  isLoggedIn: boolean;
  collectibleTokens: CollectibleToken[];
  account: string;
}

export const HarmonyAccountContext = createContext<HarmonyAccount>({
  web3Context: null,
  contract: null,
  harmonyOneBalance: "",
  tokenBalance: 0,
  isLoggedIn: false,
  collectibleTokens: [],
  harmonyOneAddress: "",
  account: "",
});
// will add support for additional wallets later

const HarmonyAccountProvider: React.FC<PropsWithChildren<{
  web3Context: Web3Context;
}>> = ({ children, web3Context }) => {
  const { networkId, accounts, lib } = web3Context;

  const [harmonyOneBalance, setHarmonyOneBalance] = useState<string>("");
  const [tokenBalance, setTokenBalance] = useState(0);
  const [collectibleTokenIds, setCollectibleTokenIds] = useState([]);
  const [collectibleTokens, setCollectibleTokens] = useState<
    CollectibleToken[]
  >([]);

  const harmonyOneAddress = useMemo(
    () => (accounts && accounts.length ? getAddress(accounts[0]).bech32 : ""),
    [accounts]
  );

  // gets total balance of One tokens as account address
  useEffect(() => {
    async function getOneBalance() {
      const balance =
        accounts && accounts.length > 0
          ? lib.utils.fromWei(await lib.eth.getBalance(accounts[0]), "ether")
          : "0";
      setHarmonyOneBalance(balance);
    }
    getOneBalance().then(() => Promise.resolve());
  }, [accounts, lib]);

  // Get our collectible contract based on the approved connection
  const contract = useMemo(() => {
    if (lib?.eth?.Contract) {
      return new lib.eth.Contract(
        // @ts-ignore
        ArtCollectibleToken.abi,
        REACT_APP_COLLECTIBLE_CONTRACT
      );
    }
    return null;
  }, [lib.eth]);

  // get the token balance of the address's tokens
  useEffect(() => {
    async function getTokenBalance() {
      if (contract && accounts && accounts?.length) {
        const collectionBalance = await contract.methods
          .balanceOf(accounts[0])
          .call();
        setTokenBalance(parseInt(collectionBalance, 10));
      }
    }
    getTokenBalance().then(() => Promise.resolve());
  }, [contract, accounts]);

  // get the token ids by index of owned NFT of the address
  useEffect(() => {
    async function getCollectibleTokenIds() {
      // create an empty array with length just
      // to take advantage of bluebird
      if (tokenBalance && accounts?.length && contract) {
        const tokens = await Bluebird.mapSeries(
          new Array(tokenBalance),
          (v, i) => contract.methods.tokenOfOwnerByIndex(accounts[0], i).call()
        );
        setCollectibleTokenIds(tokens);
      }
    }
    getCollectibleTokenIds().then(() => Promise.resolve());
  }, [tokenBalance, accounts, contract]);

  // gets the NFT metadata of the owner's tokens
  useEffect(() => {
    async function getCollectibleTokenMetadata() {
      if (collectibleTokenIds.length && contract) {
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
    }
    getCollectibleTokenMetadata().then(() => Promise.resolve());
  }, [collectibleTokenIds, contract]);

  return (
    <HarmonyAccountContext.Provider
      value={{
        web3Context,
        contract,
        harmonyOneBalance,
        tokenBalance,
        collectibleTokens,
        isLoggedIn: !(accounts && accounts.length),
        harmonyOneAddress,
        account: (accounts?.length && accounts[0]) || "",
      }}
    >
      {children}
    </HarmonyAccountContext.Provider>
  );
};

export default HarmonyAccountProvider;
