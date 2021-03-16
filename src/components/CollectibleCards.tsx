import React from "react";
import { Heading, Box, Card, Text } from "rimble-ui";
import { CollectibleToken } from "../interfaces";

const CollectibleCards: React.FC<{ collectibleTokens: CollectibleToken[] }> = ({
  collectibleTokens,
}): JSX.Element => {
  const cards = collectibleTokens.map((collectible) => {
    const {
      metadata: { name, image, description },
    } = collectible;
    return (
      <Box
        p={3}
        style={{
          minWidth: "350px",
          maxWidth: "350px",
          margin: "auto",
        }}
      >
        <Card>
          <Heading>{name}</Heading>
          <Box>
            <img src={image} alt={description} width="100px" />
          </Box>
          <Box>
            <Text>{description}</Text>
          </Box>
        </Card>
      </Box>
    );
  });
  return <>{cards}</>;
};

export default CollectibleCards;
