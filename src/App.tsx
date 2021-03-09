import React from "react";
import { useWeb3 } from "@openzeppelin/network/react";
import { Web3Info } from "./components/Web3Info";
import "./App.css";

function App() {
  const web3Context = useWeb3(`wss://ws.s0.b.hmny.io`);
  return (
    <div className="App">
      <header className="App-header">
        <div className="App">
          <div>
            <h1>OpenZeppelin Network.js</h1>
            <Web3Info title="Web3 Info" web3Context={web3Context} />
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
