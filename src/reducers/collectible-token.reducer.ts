import { Dispatch } from "react";
import { Contract } from "web3-eth-contract";
import Bluebird from "bluebird";
import axios from "axios";

import { CollectibleToken } from "../interfaces";

interface CollectibleTokenState {
  collectibleTokens: CollectibleToken[];
  loading: boolean;
  error: string | null;
}

export const initialCollectibleTokenState: CollectibleTokenState = {
  collectibleTokens: [],
  loading: false,
  error: null,
};

export type TokenActions =
  | { type: "GetTokens" }
  | { type: "GetTokensSuccess"; payload: CollectibleToken[] }
  | { type: "GetTokensFailure"; payload: string };

export const collectibleTokensReducer = (
  state: CollectibleTokenState,
  action
): CollectibleTokenState => {
  switch (action.type) {
    case "GetTokens":
      return {
        ...state,
        loading: true,
      };
    case "GetTokensSuccess":
      return {
        ...state,
        collectibleTokens: action.payload,
        loading: false,
      };
    case "GetTokensFailure":
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

export const getCollectibleTokensByAccount = (
  dispatch: Dispatch<TokenActions>,
  contract: Contract,
  account: string
) => {
  dispatch({ type: "GetTokens" });
  contract.methods
    .balanceOf(account)
    .call()
    .then(async (balance: string) => {
      if (balance) {
        const tokens = await Bluebird.mapSeries(
          new Array(parseInt(balance, 10)),
          (v, i) => contract.methods.tokenOfOwnerByIndex(account, i).call()
        );

        if (tokens.length) {
          const tokensIdAndURI = await Bluebird.map(
            tokens,
            async (tokenId) => {
              const tokenURI = await contract.methods.tokenURI(tokenId).call();
              return { tokenId, tokenURI };
            },
            { concurrency: 2 }
          );
          // annotate with the metadata
          const tokensAndMetadata = await Bluebird.mapSeries(
            tokensIdAndURI,
            async (tokenIdAndURI) => {
              const metadata = await axios
                .get(tokenIdAndURI.tokenURI)
                .then(({ data }) => data)
                .catch(() => {});
              return { ...tokenIdAndURI, metadata: { ...metadata } };
            }
          );
          dispatch({ type: "GetTokensSuccess", payload: tokensAndMetadata });
        } else {
          // do something else
          dispatch({ type: "GetTokensSuccess", payload: [] });
        }
      } else {
        // do something else
        dispatch({ type: "GetTokensSuccess", payload: [] });
      }
    })
    .catch((err) => {
      dispatch({ type: "GetTokensFailure", payload: err });
    });
};
