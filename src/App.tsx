import React from "react";
import { Box, Heading } from "rimble-ui";
import { useWeb3 } from "@openzeppelin/network/react";
import HarmonyAccountProvider from "./contexts/HarmonyAccount";
import Demo from "./components/Demo";
import "./App.css";

function App(): JSX.Element {
  const web3Context = useWeb3(`wss://ws.s0.b.hmny.io`);

  return (
    <Box className="App">
      <Heading as="h1" className="App-header">
        NFT Proof of Concept for Harmony Blockchain - Built on Testnet
      </Heading>
      <Box className="App-content">
        <HarmonyAccountProvider key="1" web3Context={web3Context}>
          <Demo />
        </HarmonyAccountProvider>
      </Box>
    </Box>
  );
}

export default App;
