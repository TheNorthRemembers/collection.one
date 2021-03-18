import { Dispatch } from "react";
import { Contract } from "web3-eth-contract";
import Web3 from "web3";
import { AbiItem } from "web3-utils";

interface ContractState {
  contract: Contract | null;
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
  | { type: "GetContractSuccess"; payload: Contract }
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
  web3: Web3
): void => {
  dispatch({ type: "GetContract" });
  const { eth } = web3;
  const contract = new eth.Contract(abi, contractAddress);
  if (contract) {
    dispatch({ type: "GetContractSuccess", payload: contract });
  }
  dispatch({ type: "GetContractFailure", payload: "Could not get contract!" });
};
