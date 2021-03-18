import React, { FC, useContext, useEffect, useReducer } from "react";
import { Flex, Box, Heading, Loader } from "rimble-ui";
import {
  initialContractState,
  contractReducer,
  getContract,
  initialCollectibleTokenState,
  collectibleTokensReducer,
  getCollectibleTokensByAccount,
} from "../reducers";
import ArtCollectibleToken from "../contracts/ArtCollectibleToken.json";
import CollectibleCards from "../components/CollectibleCards";
import { HarmonyAccountContext } from "../contexts";

const { REACT_APP_COLLECTIBLE_CONTRACT } = process.env;

const Dashboard: FC = (): JSX.Element => {
  const { web3Context, account } = useContext(HarmonyAccountContext);

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
        web3Context.lib
      );
    }
  }, [web3Context, REACT_APP_COLLECTIBLE_CONTRACT]);

  useEffect(() => {
    if (contract && account) {
      getCollectibleTokensByAccount(
        collectibleTokensDispatch,
        contract,
        account
      );
    }
  }, [contract, account]);

  return (
    <>
      <Box>
        <Flex style={{ justifyContent: "center" }}>
          <Heading as="h1">My Collectible NFTs</Heading>
        </Flex>
        <Flex style={{ flexWrap: "wrap", margin: "auto", width: "75%" }}>
          {collectibleTokens.length ? (
            <CollectibleCards collectibleTokens={collectibleTokens} />
          ) : (
            <Box
              key="collectible-loader"
              p={3}
              style={{
                width: "100%",
                margin: "auto",
              }}
            >
              <Loader size="80px" />
            </Box>
          )}
        </Flex>
      </Box>
    </>
  );
};

export default Dashboard;
