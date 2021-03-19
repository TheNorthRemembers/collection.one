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

const OneWalletLogoutButton: React.FC<Props> = ({
  harmonyExt,
  setHarmonyAccount,
  size,
}): JSX.Element => {
  const requestAuth = async (harmonyExt: HarmonyExtension | null) => {
    if (harmonyExt && setHarmonyAccount) {
      await harmonyExt.logout();
      setHarmonyAccount(null);
    }
  };

  const requestAccess = useCallback(() => requestAuth(harmonyExt), [
    harmonyExt,
    setHarmonyAccount,
  ]);

  return (
    <MetaMaskButton size={size} onClick={requestAccess}>
      Logout of One Wallet
    </MetaMaskButton>
  );
};

export default OneWalletLogoutButton;
