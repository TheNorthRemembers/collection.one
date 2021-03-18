import React, { Suspense } from "react";
import { Box, Loader } from "rimble-ui";
import { useWeb3 } from "@openzeppelin/network/react";
import { Tabs } from "antd";
import HarmonyAccountProvider from "./contexts/HarmonyAccountContext";
import "./App.css";
import "antd/dist/antd.css";

const Minter = React.lazy(() => import("./pages/Minter"));
const Header = React.lazy(() => import("./components/Header"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));

function App(): JSX.Element {
  const web3Context = useWeb3(`wss://ws.s0.b.hmny.io`);
  const { TabPane } = Tabs;

  return (
    <Box className="App">
      <Box className="App-content" my={3}>
        <HarmonyAccountProvider key="1" web3Context={web3Context}>
          <Suspense
            fallback={<Loader style={{ margin: "auto" }} size="80px" />}
          >
            <Header />
          </Suspense>
          <Tabs
            defaultActiveKey="1"
            size="large"
            type="card"
            style={{ marginBottom: 32 }}
          >
            <TabPane tab="My NFT Dashboard" key="1">
              <Suspense
                fallback={<Loader style={{ margin: "auto" }} size="80px" />}
              >
                <Dashboard />
              </Suspense>
            </TabPane>
            <TabPane tab="Mint an NFT" key="2">
              <Suspense
                fallback={<Loader style={{ margin: "auto" }} size="80px" />}
              >
                <Minter />
              </Suspense>
            </TabPane>
          </Tabs>
        </HarmonyAccountProvider>
      </Box>
    </Box>
  );
}

export default App;
