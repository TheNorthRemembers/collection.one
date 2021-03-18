import React, { useContext } from "react";
import { Flex, Card, Box } from "rimble-ui";
import MetaMaskLoginButton from "./MetaMaskLoginButton";
import NetworkIndicatorCard from "./cards/NetworkIndicatorCard";
import BalanceCard from "./cards/BalanceCard";
import { HarmonyAccountContext } from "../contexts";

const Header = () => {
  const { isLoggedIn, web3Context, harmonyOneBalance } = useContext(
    HarmonyAccountContext
  );
  return (
    <>
      {!isLoggedIn && (
        <Flex>
          <Box p={3}>
            <Card>
              <Flex>
                {!isLoggedIn && (
                  <MetaMaskLoginButton web3Context={web3Context} size="large" />
                )}
              </Flex>
            </Card>
          </Box>
        </Flex>
      )}
      <Flex>
        <Box p={3} width={1}>
          <NetworkIndicatorCard isLoggedIn={isLoggedIn} />
        </Box>
        <Box p={3} width={1}>
          <BalanceCard harmonyOneBalance={harmonyOneBalance} />
        </Box>
      </Flex>
    </>
  );
};

export default Header;
