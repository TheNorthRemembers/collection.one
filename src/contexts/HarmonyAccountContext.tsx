import React, {
  createContext,
  useEffect,
  useMemo,
  useState,
  PropsWithChildren,
} from "react";
import Web3Context from "@openzeppelin/network/lib/context/Web3Context";
import { getAddress } from "@harmony-js/crypto";

export interface HarmonyAccount {
  web3Context: Web3Context | null;
  harmonyOneBalance: string;
  harmonyOneAddress: string;
  isLoggedIn: boolean;
  account: string;
}

export const HarmonyAccountContext = createContext<HarmonyAccount>({
  web3Context: null,
  harmonyOneBalance: "",
  isLoggedIn: false,
  harmonyOneAddress: "",
  account: "",
});
// will add support for additional wallets later

const HarmonyAccountProvider: React.FC<PropsWithChildren<{
  web3Context: Web3Context;
}>> = ({ children, web3Context }) => {
  const { accounts, lib } = web3Context;

  const [harmonyOneBalance, setHarmonyOneBalance] = useState<string>("");

  const harmonyOneAddress = useMemo(
    () => (accounts && accounts.length ? getAddress(accounts[0]).bech32 : ""),
    [accounts]
  );

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
        web3Context,
        harmonyOneBalance,
        isLoggedIn: !!accounts?.length,
        harmonyOneAddress,
        account: (accounts?.length && accounts[0]) || "",
      }}
    >
      {children}
    </HarmonyAccountContext.Provider>
  );
};

export default HarmonyAccountProvider;
