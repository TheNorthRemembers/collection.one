import React, { useContext, useMemo } from "react";
import { Flex, Card, Box, EthAddress, Text } from "rimble-ui";
import MetaMaskLoginButton from "./MetaMaskLoginButton";
import OneWalletLoginButton from "./OneWalletLoginButton";
import OneWalletLogoutButton from "./OneWalletLogoutButton";
import NetworkIndicatorCard from "./cards/NetworkIndicatorCard";
import BalanceCard from "./cards/BalanceCard";
import { HarmonyAccountContext } from "../contexts";

const Header = () => {
  const {
    isLoggedInToMetamask,
    isLoggedIntoOneWallet,
    web3Context,
    balance,
    oneWalletBalance,
    setHarmonyAccount,
    harmonyExt,
  } = useContext(HarmonyAccountContext);

  const accountBalance = useMemo(() => {
    if (isLoggedInToMetamask || isLoggedIntoOneWallet) {
      return balance;
    }
    return "0";
  }, [isLoggedIntoOneWallet, isLoggedInToMetamask, balance]);

  return (
    <>
      {!isLoggedInToMetamask && !isLoggedIntoOneWallet && (
        <Flex>
          <Box p={3}>
            <Card>
              <MetaMaskLoginButton web3Context={web3Context} size="large" />
            </Card>
          </Box>
          <Box p={3}>
            <Card>
              <OneWalletLoginButton
                setHarmonyAccount={setHarmonyAccount}
                harmonyExt={harmonyExt}
                size="large"
              />
            </Card>
          </Box>
        </Flex>
      )}
      {isLoggedIntoOneWallet && (
        <Flex>
          <Box p={3}>
            <Card>
              <OneWalletLogoutButton
                setHarmonyAccount={setHarmonyAccount}
                harmonyExt={harmonyExt}
                size="large"
              />
            </Card>
          </Box>
        </Flex>
      )}
      <Box>
        <Text>
          Please consider donating for the continuation of this project.
        </Text>
        <Text>Hosting services cost $$$!</Text>
        <EthAddress
          address="one1m0hv6slgnffvwcxy2twkvlrx3l2h6q7jnm3fcy"
          textLabels
        />
      </Box>
      <Flex>
        <Box p={3} width={1}>
          <NetworkIndicatorCard
            isLoggedIn={isLoggedInToMetamask || isLoggedIntoOneWallet}
          />
        </Box>
        <Box p={3} width={1}>
          <BalanceCard harmonyOneBalance={accountBalance} />
        </Box>
      </Flex>
    </>
  );
};

export default Header;
