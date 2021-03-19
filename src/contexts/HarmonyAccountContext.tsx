import React, {
  createContext,
  useEffect,
  useMemo,
  useState,
  PropsWithChildren,
} from "react";
import Web3Context from "@openzeppelin/network/lib/context/Web3Context";
import { HarmonyExtension, ExtensionAccount } from "@harmony-js/core";
import { getAddress } from "@harmony-js/crypto";
import { Unit } from "@harmony-js/utils";

export type Wallet = "Metamask" | "OneWallet" | null;

export interface HarmonyAccount {
  web3Context: Web3Context | null;
  metaMaskBalance: string;
  metaMaskHarmonyOneAddress: string;
  isLoggedIn: boolean;
  metaMaskAccount: string;
  harmonyExt: HarmonyExtension | null;
  oneWalletBalance: string;
  oneWalletAddress: string;
  setHarmonyAccount: React.Dispatch<
    React.SetStateAction<ExtensionAccount | null>
  > | null;
}

export const HarmonyAccountContext = createContext<HarmonyAccount>({
  web3Context: null,
  metaMaskBalance: "",
  isLoggedIn: false,
  metaMaskHarmonyOneAddress: "",
  metaMaskAccount: "",
  harmonyExt: null,
  oneWalletBalance: "",
  oneWalletAddress: "",
  setHarmonyAccount: null,
});

declare global {
  interface Window {
    onewallet: any;
  }
}

window.onewallet = window.onewallet || {};

// will add support for additional wallets later

const HarmonyAccountProvider: React.FC<PropsWithChildren<{
  web3Context: Web3Context;
}>> = ({ children, web3Context }) => {
  const { accounts, lib } = web3Context;

  const [harmonyOneBalance, setHarmonyOneBalance] = useState<string>("");
  const [harmonyExt, setHarmonyExt] = useState<HarmonyExtension | null>(null);
  const [harmonyAccount, setHarmonyAccount] = useState<ExtensionAccount | null>(
    null
  );
  const [oneWalletBalance, setOneWalletBalance] = useState<string>("");
  const [wallet, setWallet] = useState<Wallet>(null);

  const harmonyOneAddress = useMemo(
    () => (accounts && accounts.length ? getAddress(accounts[0]).bech32 : ""),
    [accounts]
  );

  // let's add harmony wallet
  // create harmony extension instance
  useEffect(() => {
    async function createHarmonyOneExtension() {
      if (window && window.onewallet && HarmonyExtension) {
        setHarmonyExt(await new HarmonyExtension(window.onewallet));
      }
    }
    createHarmonyOneExtension().then(() => Promise.resolve());
  }, [window, setHarmonyExt, HarmonyExtension]);

  useEffect(() => {
    if (harmonyAccount && harmonyExt) {
      const { address } = harmonyAccount;
      harmonyExt?.blockchain
        .getBalance({ address, blockNumber: "latest" })
        .then(({ result }) => setOneWalletBalance(Unit.Wei(result).toEther()));
    }
  }, [harmonyAccount, harmonyExt]);

  // gets total balance of One tokens as account address
  useEffect(() => {
    async function getOneBalance() {
      const balance =
        accounts && accounts.length > 0
          ? lib.utils.fromWei(await lib.eth.getBalance(accounts[0]), "ether")
          : "0";
      setHarmonyOneBalance(balance);
    }
    getOneBalance().then(() => Promise.resolve());
  }, [accounts, lib]);

  return (
    <HarmonyAccountContext.Provider
      value={{
        // metamask logins
        web3Context,
        metaMaskBalance: harmonyOneBalance,
        metaMaskHarmonyOneAddress: harmonyOneAddress,
        metaMaskAccount: (accounts?.length && accounts[0]) || "",
        // harmony wallet only
        harmonyExt,
        oneWalletBalance,
        oneWalletAddress: (harmonyAccount && harmonyAccount.address) || "",
        setHarmonyAccount,
        // univeral logged in
        isLoggedIn: !!accounts?.length || !!harmonyAccount?.address,
      }}
    >
      {children}
    </HarmonyAccountContext.Provider>
  );
};

export default HarmonyAccountProvider;
