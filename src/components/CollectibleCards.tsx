import React from "react";
import { Heading, Box, Card, Text } from "rimble-ui";
import { CollectibleToken } from "../interfaces";

const fallBackImage =
  "https://ipfs.io/ipfs/QmPGNBf8qGJ6vpNJsgaQvSZMi9YUWdsd2t84fESNWNwPXC";

const CollectibleCards: React.FC<{ collectibleTokens: CollectibleToken[] }> = ({
  collectibleTokens,
}): JSX.Element => {
  const addDefaultSrc = (e) => {
    e.target.src = fallBackImage;
  };

  const cards = collectibleTokens.map((collectible) => {
    const {
      tokenId,
      metadata: { name, image, description },
    } = collectible;
    return (
      <Box
        key={`collectible-${tokenId}`}
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
            <img
              src={image}
              alt={description}
              width="100px"
              onError={addDefaultSrc}
            />
          </Box>
          <Box>
            <Text>{description}</Text>
          </Box>
          <Box>
            <Text fontWeight="bold">#{tokenId}</Text>
          </Box>
        </Card>
      </Box>
    );
  });
  return <>{cards}</>;
};

export default CollectibleCards;
