import React, { useMemo, FC } from "react";
import { Flex, Tooltip, Icon, Text, Card } from "rimble-ui";
import { Web3Context } from "@openzeppelin/network";
import MetaMaskLoginButton from "../MetaMaskLoginButton";

interface Props {
  isLoggedIn: boolean;
  web3Context: Web3Context | null;
}

const NetworkIndicatorCard: FC<Props> = ({ isLoggedIn, web3Context }) => {
  const { message, icon, color } = useMemo(() => {
    if (isLoggedIn) {
      return { message: "Logged In", icon: "CheckCircle", color: "success" };
    }
    return { message: "Please Log In", icon: "Error", color: "danger" };
  }, [isLoggedIn]);

  return (
    <Card>
      <Flex flexDirection="column">
        <Text fontSize={1} color="silver" caps>
          Current Network
        </Text>
        <Tooltip message={message}>
          <Flex>
            <Text mr={2}>Harmony One Testnet</Text>
            <Icon name={icon} color={color} />
          </Flex>
        </Tooltip>
        <Text>
          {!isLoggedIn && (
            <MetaMaskLoginButton web3Context={web3Context} size="small" />
          )}
        </Text>
      </Flex>
    </Card>
  );
};

export default NetworkIndicatorCard;
