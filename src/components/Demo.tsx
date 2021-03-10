import React, { useContext } from "react";
import { EthAddress, Box, Heading, Pill } from "rimble-ui";
import { HarmonyAccountContext } from "../contexts/HarmonyAccount";
import MetaMaskLoginButton from "./MetaMaskLoginButton";
import CollectibleCards from "./CollectibleCards";

const { REACT_APP_COLLECTIBLE_CONTRACT } = process.env;

const Demo = (): JSX.Element => {
  const {
    isLoggedIn,
    web3Context,
    collectibleTokens,
    harmonyOneBalance,
    harmonyOneAddress,
  } = useContext(HarmonyAccountContext);

  return (
    <>
      <Box>
        <Heading as="h2">Harmony One Balance: {harmonyOneBalance}</Heading>
        <Heading as="h2">Contract address</Heading>
        <EthAddress address={REACT_APP_COLLECTIBLE_CONTRACT} />
      </Box>
      <Heading as="h2">Collectibles owned by {harmonyOneAddress}</Heading>
      <Box>
        <CollectibleCards collectibleTokens={collectibleTokens} />
        {!isLoggedIn && <MetaMaskLoginButton web3Context={web3Context} />}
      </Box>
    </>
  );
};

export default Demo;
