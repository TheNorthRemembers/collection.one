import React, { useMemo, FC } from "react";
import { Flex, Tooltip, Icon, Text, Card } from "rimble-ui";
import { Web3Context } from "@openzeppelin/network";

interface Props {
  isLoggedIn: boolean;
}

const NetworkIndicatorCard: FC<Props> = ({ isLoggedIn }) => {
  const { message, icon, color } = useMemo(() => {
    if (isLoggedIn) {
      return { message: "Logged In", icon: "CheckCircle", color: "success" };
    }
    return { message: "Please Log In", icon: "Error", color: "danger" };
  }, [isLoggedIn]);

  return (
    <Card style={{ minWidth: "270px" }}>
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
      </Flex>
    </Card>
  );
};

export default NetworkIndicatorCard;
