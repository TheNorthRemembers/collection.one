import { Dispatch } from "react";
import { Contract } from "web3-eth-contract";
import { Eth } from "web3-eth";
import { AbiItem } from "web3-utils";
import { HarmonyExtension } from "@harmony-js/core";
import { Contract as HarmonyContract } from "@harmony-js/contract";

interface ContractState {
  contract: Contract | HarmonyContract | null;
  loading: boolean;
  error: string | null;
}

export const initialContractState: ContractState = {
  contract: null,
  loading: false,
  error: null,
};

export type ContractActions =
  | { type: "GetContract" }
  | { type: "GetContractSuccess"; payload: Contract | HarmonyContract }
  | { type: "GetContractFailure"; payload: string };

export const contractReducer = (
  state: ContractState,
  action: ContractActions
): ContractState => {
  switch (action.type) {
    case "GetContract":
      return {
        ...state,
        loading: true,
      };
    case "GetContractSuccess":
      return {
        ...state,
        contract: action.payload,
        loading: false,
      };
    case "GetContractFailure":
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

export const getContract = (
  dispatch: Dispatch<ContractActions>,
  contractAddress: string,
  abi: AbiItem | AbiItem[],
  eth: Eth
): void => {
  dispatch({ type: "GetContract" });

  const contract = new eth.Contract(abi, contractAddress);
  if (contract) {
    dispatch({ type: "GetContractSuccess", payload: contract });
  }
  dispatch({ type: "GetContractFailure", payload: "Could not get contract!" });
};

export const getOneWalletContract = (
  dispatch: Dispatch<ContractActions>,
  contractAddress: string,
  abi: AbiItem[],
  harmonyExt: HarmonyExtension
): void => {
  dispatch({ type: "GetContract" });

  const contract = harmonyExt.contracts.createContract(abi, contractAddress);
  if (contract) {
    dispatch({ type: "GetContractSuccess", payload: contract });
  }
  dispatch({ type: "GetContractFailure", payload: "Could not get contract!" });
};
