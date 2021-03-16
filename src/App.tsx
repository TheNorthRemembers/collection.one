import React from "react";
import { Box, Heading } from "rimble-ui";
import { useWeb3 } from "@openzeppelin/network/react";
import HarmonyAccountProvider from "./contexts/HarmonyAccountContext";
import Dashboard from "./pages/Dashboard";
import "./App.css";

function App(): JSX.Element {
  const web3Context = useWeb3(`wss://ws.s0.b.hmny.io`);

  return (
    <Box className="App">
      <Box className="App-content" my={3}>
        <HarmonyAccountProvider key="1" web3Context={web3Context}>
          <Dashboard />
        </HarmonyAccountProvider>
      </Box>
    </Box>
  );
}

export default App;
