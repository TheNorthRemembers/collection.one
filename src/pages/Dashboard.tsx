import React, { FC, useContext, useEffect, useMemo, useReducer } from "react";
import { Flex, Tooltip, Icon, Text, Card, Box } from "rimble-ui";
import NetworkIndicatorCard from "../components/cards/NetworkIndicatorCard";
import BalanceCard from "../components/cards/BalanceCard";
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
  const { isLoggedIn, web3Context, harmonyOneBalance, account } = useContext(
    HarmonyAccountContext
  );

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
      <Flex>
        <Box p={3} width={1}>
          <NetworkIndicatorCard
            web3Context={web3Context}
            isLoggedIn={isLoggedIn}
          />
        </Box>
        <Box p={3} width={1}>
          <BalanceCard harmonyOneBalance={harmonyOneBalance} />
        </Box>
      </Flex>

      <Flex style={{ flexWrap: "wrap", margin: "auto", width: "50%" }}>
        {collectibleTokens.length ? (
          <CollectibleCards collectibleTokens={collectibleTokens} />
        ) : null}
      </Flex>
    </>
  );
};

export default Dashboard;
