import React, {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import {
  Flex,
  Box,
  Heading,
  Field,
  Input,
  Button,
  Loader,
  Text,
} from "rimble-ui";
import axios from "axios";
import { Textarea } from "../components/inputs";
import { TokenMetadata } from "../interfaces";
import { HarmonyAccountContext } from "../contexts/HarmonyAccountContext";
import {
  contractReducer,
  getContract,
  initialContractState,
} from "../reducers";
import ArtCollectibleToken from "../contracts/ArtCollectibleToken.json";

const { REACT_APP_COLLECTIBLE_CONTRACT } = process.env;

const Minter: FC = (): JSX.Element => {
  const { metaMaskAccount, web3Context, isLoggedIn } = useContext(
    HarmonyAccountContext
  );

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [artist, setArtist] = useState<string>("");
  const [tokenUri, setTokenUri] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [image, setImage] = useState<string>("");

  const [stepMessage, setStepMessage] = useState<string | null>(null);

  const step = useMemo(() => {
    if (stepMessage) {
      return (
        <Box>
          <Text my={4}>{stepMessage}</Text>
          <Loader style={{ margin: "auto" }} size="80px" />
        </Box>
      );
    }
    return null;
  }, [stepMessage]);

  // TODO - maybe move this in App since it's reused

  const [{ contract }, contractDispatch] = useReducer(
    contractReducer,
    initialContractState
  );

  useEffect(() => {
    if (web3Context && REACT_APP_COLLECTIBLE_CONTRACT) {
      getContract(
        contractDispatch,
        REACT_APP_COLLECTIBLE_CONTRACT,
        // @ts-ignore
        ArtCollectibleToken.abi, // ignored because of Solidity verions
        web3Context.lib.eth
      );
    }
  }, [web3Context, REACT_APP_COLLECTIBLE_CONTRACT]);

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

  const handleFileInput = (e) => {
    // handle validations
    setSelectedFile(e.target.files[0]);
  };

  const handleInput = (e, set) => {
    set(e.target.value);
  };

  const submitForm = useCallback(() => {
    setStepMessage("Uploading file to IPFS...");
    const formData = new FormData();
    formData.append("file", selectedFile);
    axios
      .post(`${process.env.REACT_APP_IPFS_SERVER}/upload`, formData)
      // @ts-ignore
      .then(({ data: { file: { path } } }) =>
        setImage(`https://ipfs.io/ipfs/${path}`)
      );
  }, [selectedFile]);

  useEffect(() => {
    if (nftMetadata) {
      // upload metadata file
      setStepMessage("Generating and uploading metadata...");
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
        setStepMessage("Creating transaction and minting your NFT!");
        await contract.methods
          .mint(metaMaskAccount, image, artist, tokenUri)
          .send({
            from: metaMaskAccount,
            gasLimit: 3321900,
            gasPrice: 1000000000,
          });
        setStepMessage(null);
      }
    }

    mint();
  }, [artist, image, tokenUri, contract]);

  const buttonDisabled = useMemo(() => {
    return !(
      artist &&
      contract &&
      selectedFile &&
      name &&
      description &&
      isLoggedIn
    );
  }, [artist, contract, selectedFile, name, description, isLoggedIn]);

  const headerMessage = useMemo(() => {
    if (isLoggedIn) {
      return "Mint an NFT";
    }
    return "Please Log In to Mint an NFT";
  }, [isLoggedIn]);

  return (
    <>
      <Box>
        <Flex style={{ justifyContent: "center" }}>
          <Heading as="h1">{headerMessage}</Heading>
        </Flex>
        {isLoggedIn && (
          <>
            {step || (
              <>
                <Flex style={{ flexWrap: "wrap", margin: "auto" }}>
                  <Box>
                    <Field label="Nft Name" mx={3}>
                      <Input
                        type="text"
                        required
                        placeholder="NFT Name"
                        onChange={(e) => handleInput(e, setName)}
                        value={name}
                      />
                    </Field>
                    <Field label="Artist" mx={3}>
                      <Input
                        type="text"
                        required
                        placeholder="artist"
                        onChange={(e) => handleInput(e, setArtist)}
                        value={artist}
                      />
                    </Field>
                  </Box>
                </Flex>
                <Box>
                  <Field
                    label="NFT Description"
                    mx={3}
                    style={{ display: "flex" }}
                  >
                    <Textarea
                      rows={4}
                      required
                      placeholder="description"
                      onChange={(e) => handleInput(e, setDescription)}
                      value={description}
                    />
                  </Field>
                </Box>
                <Field label="Upload an NFT Image">
                  <Input type="file" required onChange={handleFileInput} />
                </Field>
                <Box>
                  <Button
                    type="button"
                    onClick={submitForm}
                    disabled={buttonDisabled}
                  >
                    Create NFT
                  </Button>
                </Box>
              </>
            )}
          </>
        )}
      </Box>
    </>
  );
};

export default Minter;
