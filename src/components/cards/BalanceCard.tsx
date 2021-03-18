import React from "react";
import { Flex, Text, Card } from "rimble-ui";

interface Props {
  harmonyOneBalance: string;
}

const BalanceCard: React.FC<Props> = ({ harmonyOneBalance }) => {
  return (
    <Card style={{ minWidth: "270px" }}>
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
