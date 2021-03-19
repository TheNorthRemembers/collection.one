import React, { useCallback, useEffect } from "react";
import { MetaMaskButton } from "rimble-ui";
import { ExtensionAccount, HarmonyExtension } from "@harmony-js/core";
import { Wallet } from "../contexts";

interface Props {
  harmonyExt: HarmonyExtension | null;
  setHarmonyAccount: React.Dispatch<
    React.SetStateAction<ExtensionAccount | null>
  > | null;
  size: string;
}

const OneWalletLoginButton: React.FC<Props> = ({
  harmonyExt,
  setHarmonyAccount,
  size,
}): JSX.Element => {
  const requestAuth = async (harmonyExt: HarmonyExtension | null) => {
    if (harmonyExt && setHarmonyAccount) {
      await harmonyExt
        .login()
        .then((acc) => {
          // Todo with the account
          setHarmonyAccount(acc);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const requestAccess = useCallback(() => requestAuth(harmonyExt), [
    setHarmonyAccount,
    harmonyExt,
  ]);

  return (
    <MetaMaskButton size={size} onClick={requestAccess}>
      Connect with One Wallet
    </MetaMaskButton>
  );
};

export default OneWalletLoginButton;
