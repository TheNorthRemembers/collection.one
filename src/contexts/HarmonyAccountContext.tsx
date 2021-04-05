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
//  TODO refactor this, make it uniform
export interface HarmonyAccount {
  web3Context: Web3Context | null;
  balance: string;
  metaMaskHarmonyOneAddress: string;
  isLoggedInToMetamask: boolean;
  isLoggedIntoOneWallet: boolean;
  isLoggedIn: boolean;
  metaMaskAccount: string;
  harmonyExt: HarmonyExtension | null;
  oneWalletBalance: string;
  oneWalletAddress: string;
  setHarmonyAccount: React.Dispatch<
    React.SetStateAction<ExtensionAccount | null>
  > | null;
  onewallet: any;
}

export const HarmonyAccountContext = createContext<HarmonyAccount>({
  web3Context: null,
  balance: "",
  isLoggedInToMetamask: false,
  metaMaskHarmonyOneAddress: "",
  metaMaskAccount: "",
  harmonyExt: null,
  oneWalletBalance: "",
  oneWalletAddress: "",
  setHarmonyAccount: null,
  isLoggedIntoOneWallet: false,
  isLoggedIn: false,
  onewallet: null,
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

  // Metamask
  const harmonyOneAddress = useMemo(
    () => (accounts && accounts.length ? getAddress(accounts[0]).bech32 : ""),
    [accounts]
  );

  // let's add harmony wallet
  // create harmony extension instance
  useEffect(() => {
    async function createHarmonyOneExtension() {
      if (
        window &&
        window.onewallet &&
        Object.keys(window.onewallet).length &&
        HarmonyExtension
      ) {
        try {
          console.log(window.onewallet);
          const ext = await new HarmonyExtension(window.onewallet);
          ext.setProvider("https://api.s0.b.hmny.io/");
          setHarmonyExt(ext);
        } catch (err) {
          console.log(err);
          // do nothing
          // sometimes the extension is not ready, it will repeat
        }
      }
    }
    createHarmonyOneExtension().then(() => Promise.resolve());
  }, [window, setHarmonyExt, HarmonyExtension]);

  useEffect(() => {
    if (harmonyAccount && harmonyExt) {
      const { address } = harmonyAccount;
      harmonyExt?.blockchain
        .getBalance({ address, blockNumber: "latest" })
        .then(({ result }) => setHarmonyOneBalance(Unit.Wei(result).toEther()));
    }
  }, [harmonyAccount, harmonyExt]);

  // gets total balance of One tokens as account addresss - using Metamask
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
        balance: harmonyOneBalance,
        metaMaskHarmonyOneAddress: harmonyOneAddress,
        metaMaskAccount: (accounts?.length && accounts[0]) || "",
        // harmony wallet only
        harmonyExt,
        oneWalletBalance,
        oneWalletAddress: (harmonyAccount && harmonyAccount.address) || "",
        setHarmonyAccount,
        // univeral logged in
        isLoggedInToMetamask: !!accounts?.length,
        isLoggedIntoOneWallet: !!(harmonyAccount && harmonyAccount.address),
        isLoggedIn:
          !!accounts?.length || !!(harmonyAccount && harmonyAccount.address),
        onewallet: window && window.onewallet,
      }}
    >
      {children}
    </HarmonyAccountContext.Provider>
  );
};

export default HarmonyAccountProvider;
