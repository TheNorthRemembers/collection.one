import React from "react";
import { Flex, Text, Card } from "rimble-ui";

interface Props {
  harmonyOneBalance: string;
}

const BalanceCard = ({ harmonyOneBalance }) => {
  return (
    <Card>
      <Flex flexDirection="column">
        <Text fontSize={1} color="silver" caps>
          Harmony One Balance
        </Text>
        <Text>{harmonyOneBalance}</Text>
      </Flex>
    </Card>
  );
};

export default BalanceCard;
