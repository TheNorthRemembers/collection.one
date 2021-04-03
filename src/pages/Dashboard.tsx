import React, { FC, useContext, useEffect, useMemo, useReducer } from "react";
import { Flex, Box, Heading, Loader } from "rimble-ui";
import {
  initialContractState,
  contractReducer,
  getContract,
  getOneWalletContract,
  initialCollectibleTokenState,
  collectibleTokensReducer,
  getCollectibleTokensByAccount,
  getCollectibleTokensByAccountForOneWallet,
} from "../reducers";
import ArtCollectibleToken from "../contracts/ArtCollectibleToken.json";
import CollectibleCards from "../components/CollectibleCards";
import { HarmonyAccountContext } from "../contexts";

const { REACT_APP_COLLECTIBLE_CONTRACT } = process.env;

const Dashboard: FC = (): JSX.Element => {
  const {
    web3Context,
    metaMaskAccount,
    isLoggedInToMetamask,
    isLoggedIntoOneWallet,
    harmonyExt,
    oneWalletAddress,
    isLoggedIn,
    onewallet,
  } = useContext(HarmonyAccountContext);

  const [{ contract }, contractDispatch] = useReducer(
    contractReducer,
    initialContractState
  );

  const [{ collectibleTokens }, collectibleTokensDispatch] = useReducer(
    collectibleTokensReducer,
    initialCollectibleTokenState
  );

  useEffect(() => {
    if (web3Context && REACT_APP_COLLECTIBLE_CONTRACT && isLoggedInToMetamask) {
      getContract(
        contractDispatch,
        REACT_APP_COLLECTIBLE_CONTRACT,
        // @ts-ignore
        ArtCollectibleToken.abi, // ignored because of Solidity verions
        web3Context.lib.eth
      );
    } else if (
      harmonyExt &&
      REACT_APP_COLLECTIBLE_CONTRACT &&
      isLoggedIntoOneWallet &&
      onewallet
    ) {
      const { abi } = ArtCollectibleToken;
      getOneWalletContract(
        contractDispatch,
        REACT_APP_COLLECTIBLE_CONTRACT,
        // @ts-ignore
        abi, // ignored because of Solidity versions
        harmonyExt,
        onewallet
      );
    }
  }, [
    web3Context,
    REACT_APP_COLLECTIBLE_CONTRACT,
    harmonyExt,
    isLoggedInToMetamask,
    isLoggedIntoOneWallet,
    onewallet,
  ]);

  useEffect(() => {
    if (contract && metaMaskAccount && isLoggedInToMetamask) {
      getCollectibleTokensByAccount(
        collectibleTokensDispatch,
        contract,
        metaMaskAccount
      );
    } else if (contract && oneWalletAddress && isLoggedIntoOneWallet) {
      const address = harmonyExt?.crypto.getAddress(oneWalletAddress).basicHex;
      getCollectibleTokensByAccountForOneWallet(
        collectibleTokensDispatch,
        contract,
        address
      );
    }
  }, [
    contract,
    metaMaskAccount,
    oneWalletAddress,
    isLoggedIntoOneWallet,
    isLoggedInToMetamask,
  ]);

  const headerMessage = useMemo(() => {
    if (isLoggedIn) {
      return "My Collectible NFTs";
    }
    return "Please Log In to View Your NFT Collectibles";
  }, [isLoggedIn]);

  return (
    <>
      <Box>
        <Flex style={{ justifyContent: "center" }}>
          <Heading as="h1">{headerMessage}</Heading>
        </Flex>
        {isLoggedIn && (
          <Flex style={{ flexWrap: "wrap", margin: "auto", width: "75%" }}>
            {collectibleTokens.length ? (
              <CollectibleCards collectibleTokens={collectibleTokens} />
            ) : (
              <Box
                key="collectible-loader"
                p={3}
                style={{
                  margin: "auto",
                }}
              >
                <Loader size="80px" />
              </Box>
            )}
          </Flex>
        )}
      </Box>
    </>
  );
};

export default Dashboard;
