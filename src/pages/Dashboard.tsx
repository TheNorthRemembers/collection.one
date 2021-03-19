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
} from "../reducers";
import ArtCollectibleToken from "../contracts/ArtCollectibleToken.json";
import CollectibleCards from "../components/CollectibleCards";
import { HarmonyAccountContext } from "../contexts";

const { REACT_APP_COLLECTIBLE_CONTRACT } = process.env;

const Dashboard: FC = (): JSX.Element => {
  const {
    web3Context,
    metaMaskAccount,
    isLoggedIn,
    harmonyExt,
    oneWalletAddress,
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
    if (web3Context && REACT_APP_COLLECTIBLE_CONTRACT) {
      getContract(
        contractDispatch,
        REACT_APP_COLLECTIBLE_CONTRACT,
        // @ts-ignore
        ArtCollectibleToken.abi, // ignored because of Solidity verions
        web3Context.lib.eth
      );
    } else if (harmonyExt && REACT_APP_COLLECTIBLE_CONTRACT) {
      getOneWalletContract(
        contractDispatch,
        REACT_APP_COLLECTIBLE_CONTRACT,
        // @ts-ignore
        ArtCollectibleToken.abi, // ignored because of Solidity verions
        harmonyExt
      );
    }
  }, [web3Context, REACT_APP_COLLECTIBLE_CONTRACT, harmonyExt]);

  useEffect(() => {
    if (contract && metaMaskAccount) {
      getCollectibleTokensByAccount(
        collectibleTokensDispatch,
        contract,
        metaMaskAccount
      );
    }
    // if (contract && oneWalletAddress) {
    //   getCollectibleTokensByAccount(
    //     collectibleTokensDispatch,
    //     contract,
    //     oneWalletAddress
    //   );
    // }
  }, [contract, metaMaskAccount, oneWalletAddress]);

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
