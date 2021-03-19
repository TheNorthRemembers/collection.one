import React, { useContext } from "react";
import { Flex, Card, Box, EthAddress, Text } from "rimble-ui";
import MetaMaskLoginButton from "./MetaMaskLoginButton";
import OneWalletLoginButton from "./OneWalletLoginButton";
import OneWalletLogoutButton from "./OneWalletLogoutButton";
import NetworkIndicatorCard from "./cards/NetworkIndicatorCard";
import BalanceCard from "./cards/BalanceCard";
import { HarmonyAccountContext } from "../contexts";

const Header = () => {
  const {
    isLoggedIn,
    web3Context,
    metaMaskBalance,
    setHarmonyAccount,
    harmonyExt,
  } = useContext(HarmonyAccountContext);
  return (
    <>
      {!isLoggedIn ? (
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
      ) : (
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
          <NetworkIndicatorCard isLoggedIn={isLoggedIn} />
        </Box>
        <Box p={3} width={1}>
          <BalanceCard harmonyOneBalance={metaMaskBalance} />
        </Box>
      </Flex>
    </>
  );
};

export default Header;
