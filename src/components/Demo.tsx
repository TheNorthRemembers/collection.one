import React, {
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import {
  EthAddress,
  Box,
  Heading,
  Button,
  Form,
  Field,
  Input,
} from "rimble-ui";
import axios from "axios";
import { HarmonyAccountContext } from "../contexts/HarmonyAccount";
import MetaMaskLoginButton from "./MetaMaskLoginButton";
import CollectibleCards from "./CollectibleCards";
import { TokenMetadata } from "../interfaces";

const { REACT_APP_COLLECTIBLE_CONTRACT } = process.env;

const Demo = (): JSX.Element => {
  const {
    isLoggedIn,
    web3Context,
    collectibleTokens,
    harmonyOneBalance,
    harmonyOneAddress,
    contract,
    account,
  } = useContext(HarmonyAccountContext);

  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [image, setImage] = useState<string>("");
  // const [nftMetadata, setNftMetadata] = useState<TokenMetadata | null>(null);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [artist, setArtist] = useState<string>("");
  const [tokenUri, setTokenUri] = useState<string | null>(null);

  const nftMetadata: TokenMetadata | null = useMemo(() => {
    if (name && description && image) {
      return {
        name,
        image,
        description,
      };
    }
    return null;
  }, [name, description, image]);

  useEffect(() => {
    if (nftMetadata) {
      // upload metadata file
      axios
        .post(`${process.env.REACT_APP_IPFS_SERVER}/tokenuri`, nftMetadata)
        // @ts-ignore
        .then(({ data: { file: { path } } }) =>
          setTokenUri(`https://ipfs.io/ipfs/${path}`)
        );
    }
  }, [nftMetadata]);

  useEffect(() => {
    // let's mint!
    async function mint() {
      if (artist && image && tokenUri && contract) {
        const result = await contract.methods
          .mint(account, image, artist, tokenUri)
          .send({ from: account });
        console.log(result);
      }
    }

    mint();
  }, [artist, image, tokenUri, contract]);

  const handleFileInput = (e) => {
    // handle validations
    setSelectedFile(e.target.files[0]);
  };

  const handleInput = (e, set) => {
    set(e.target.value);
  };

  const submitForm = useCallback(() => {
    const formData = new FormData();
    formData.append("file", selectedFile);
    axios
      .post(`${process.env.REACT_APP_IPFS_SERVER}/upload`, formData)
      // @ts-ignore
      .then(({ data: { file: { path } } }) =>
        setImage(`https://ipfs.io/ipfs/${path}`)
      );
  }, [selectedFile]);

  return (
    <>
      <Box>
        <Heading as="h2">Harmony One Balance: {harmonyOneBalance}</Heading>
        <Heading as="h2">Contract address</Heading>
        <EthAddress address={REACT_APP_COLLECTIBLE_CONTRACT} />
      </Box>
      <Heading as="h2">Collectibles owned by {harmonyOneAddress}</Heading>
      <Box>
        <CollectibleCards collectibleTokens={collectibleTokens} />
        {isLoggedIn && (
          <MetaMaskLoginButton web3Context={web3Context} size="large" />
        )}
      </Box>
      <Box>
        <Heading as="h2">Minting Demo</Heading>
        <Form>
          <Field label="Upload an NFT Image">
            <Input type="file" required onChange={handleFileInput} />
          </Field>
          <Field label="Name">
            <Input
              type="text"
              required
              placeholder="title"
              onChange={(e) => handleInput(e, setName)}
              value={name}
            />
          </Field>
          <Field label="Description">
            <Input
              type="text"
              required
              placeholder="description"
              onChange={(e) => handleInput(e, setDescription)}
              value={description}
            />
          </Field>
          <Field label="Artist">
            <Input
              type="text"
              required
              placeholder="artist"
              onChange={(e) => handleInput(e, setArtist)}
              value={artist}
            />
          </Field>
          <Box>
            <Button type="button" onClick={submitForm}>
              Create NFT
            </Button>
          </Box>
        </Form>
      </Box>
    </>
  );
};

export default Demo;
