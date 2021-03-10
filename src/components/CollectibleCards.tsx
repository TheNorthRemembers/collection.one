import React from "react";
import { Heading, Box, Card, Text } from "rimble-ui";
import {
  CollectibleToken,
  HarmonyAccountContext,
} from "../contexts/HarmonyAccount";

const CollectibleCards: React.FC<{ collectibleTokens: CollectibleToken[] }> = ({
  collectibleTokens,
}): JSX.Element => {
  const cards = collectibleTokens.map((collectible) => {
    const {
      metadata: { name, image, description },
    } = collectible;
    return (
      <Card>
        <Heading>{name}</Heading>
        <Box>
          <img src={image} alt={description} />
        </Box>
        <Box>
          <Text>{description}</Text>
        </Box>
      </Card>
    );
  });

  return <>{cards}</>;
};

export default CollectibleCards;
