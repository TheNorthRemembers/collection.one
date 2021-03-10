import React, { useCallback } from "react";
import Web3Context from "@openzeppelin/network/lib/context/Web3Context";
import { MetaMaskButton } from "rimble-ui";

interface Props {
  web3Context: Web3Context | null;
}

const MetaMaskLoginButton: React.FC<Props> = ({ web3Context }): JSX.Element => {
  const requestAuth = async (web3Context: Web3Context | null) => {
    if (web3Context) {
      try {
        await web3Context.requestAuth();
      } catch (e) {
        // console.error(e);
      }
    }
  };

  const requestAccess = useCallback(() => requestAuth(web3Context), []);

  return (
    <MetaMaskButton size="large" onClick={requestAccess}>
      Connect with MetaMask
    </MetaMaskButton>
  );
};

export default MetaMaskLoginButton;
