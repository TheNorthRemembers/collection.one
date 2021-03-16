export interface CollectibleToken {
  tokenId: number;
  tokenUri: string;
  metadata: {
    image: string;
    name: string;
    description: string;
    [key: string]: string;
  };
}
