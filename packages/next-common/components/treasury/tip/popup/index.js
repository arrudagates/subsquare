import React, { useState } from "react";
import { useDispatch } from "react-redux";
import useIsMounted from "../../../../utils/hooks/useIsMounted";
import { newErrorToast } from "../../../../store/reducers/toastSlice";

import { checkInputValue, isAddressInGroup } from "../../../../utils";
import PopupWithSigner from "../../../popupWithSigner";
import Beneficiary from "../../common/beneficiary";
import TipReason from "./tipReason";
import Tab, { NewTip, ReportAwesome } from "./tab";
import TipValue from "./tipValue";
import { sendTx, wrapWithProxy } from "../../../../utils/sendTx";
import PrimaryButton from "../../../buttons/primaryButton";
import { useChainSettings } from "../../../../context/chain";
import { PopupButtonWrapper } from "../../../popup/wrapper";
import {
  useExtensionAccounts,
  useSignerAccount,
} from "next-common/components/popupWithSigner/context";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import { useRouter } from "next/router";
import { useContextApi } from "next-common/context/api";
import useCouncilMembers from "next-common/utils/hooks/useCouncilMembers";
import { WarningMessage } from "next-common/components/popup/styled";
import { usePopupParams } from "next-common/components/popupWithSigner/context";

function TipCommon({ setBeneficiary, setReason }) {
  const extensionAccounts = useExtensionAccounts();

  return (
    <>
      <SignerWithBalance />
      <Beneficiary
        extensionAccounts={extensionAccounts}
        setAddress={setBeneficiary}
      />
      <TipReason setValue={setReason} />
    </>
  );
}

function SubmitButton({ disabled, loading, onSubmit }) {
  return (
    <PopupButtonWrapper>
      <PrimaryButton disabled={disabled} isLoading={loading} onClick={onSubmit}>
        Submit
      </PrimaryButton>
    </PopupButtonWrapper>
  );
}

function ReportAwesomeContent({
  setBeneficiary,
  setReason,
  loading,
  onSubmit,
}) {
  return (
    <>
      <TipCommon setBeneficiary={setBeneficiary} setReason={setReason} />
      <SubmitButton loading={loading} onSubmit={onSubmit} />
    </>
  );
}

function NewTipContent({
  setBeneficiary,
  setReason,
  setInputValue,
  loading,
  onSubmit,
}) {
  const signerAccount = useSignerAccount();
  const councilTippers = useCouncilMembers();
  const isTipper = isAddressInGroup(
    signerAccount?.realAddress,
    councilTippers || [],
  );
  return (
    <>
      <WarningMessage danger={!isTipper}>
        Only council members can create new tip.
      </WarningMessage>
      <TipCommon setBeneficiary={setBeneficiary} setReason={setReason} />
      <TipValue setValue={setInputValue} />
      <SubmitButton
        disabled={!isTipper}
        loading={loading}
        onSubmit={onSubmit}
      />
    </>
  );
}

function PopupContent() {
  const { onClose } = usePopupParams();
  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const signerAccount = useSignerAccount();
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [tabIndex, setTabIndex] = useState(ReportAwesome);
  const [inputValue, setInputValue] = useState("0");
  const { decimals } = useChainSettings();
  const api = useContextApi();
  const router = useRouter();

  const [beneficiary, setBeneficiary] = useState();

  const showErrorToast = (message) => dispatch(newErrorToast(message));

  const submit = async () => {
    if (!api) {
      return showErrorToast("Chain network is not connected yet");
    }

    if (!signerAccount) {
      return showErrorToast("Please login first");
    }

    if (!beneficiary) {
      return showErrorToast("Please input a beneficiary");
    }

    if (!reason) {
      return showErrorToast("Please input a reason");
    }

    let tx;

    if (tabIndex === NewTip) {
      let bnValue;
      try {
        bnValue = checkInputValue(inputValue, decimals, "tip value");
      } catch (err) {
        return showErrorToast(err.message);
      }

      tx = api.tx.tips.tipNew(reason, beneficiary, bnValue.toString());
    } else {
      tx = api.tx.tips.reportAwesome(reason, beneficiary);
    }

    if (signerAccount?.proxyAddress) {
      tx = wrapWithProxy(api, tx, signerAccount.proxyAddress);
    }

    await sendTx({
      tx,
      dispatch,
      setLoading,
      onInBlock: (eventData, blockHash) => {
        if (!eventData || !blockHash) {
          return;
        }
        api?.rpc.chain.getHeader(blockHash).then((header) => {
          const blockNumber = header.number.toNumber();
          const [tipHash] = eventData;
          router.push(`/treasury/tips/${blockNumber}_${tipHash}`);
        });
      },
      onClose,
      signerAccount,
      isMounted,
      section: "tips",
      method: "NewTip",
    });
  };

  return (
    <>
      <div style={{ marginTop: "16px", marginBottom: "16px" }}>
        <Tab tabIndex={tabIndex} setTabIndex={setTabIndex} />
      </div>
      {tabIndex === NewTip ? (
        <NewTipContent
          onSubmit={submit}
          setBeneficiary={setBeneficiary}
          setReason={setReason}
          setInputValue={setInputValue}
          loading={loading}
        />
      ) : (
        <ReportAwesomeContent
          onSubmit={submit}
          setBeneficiary={setBeneficiary}
          setReason={setReason}
          loading={loading}
        />
      )}
    </>
  );
}

export default function Popup(props) {
  return (
    <PopupWithSigner title="New Tip" {...props}>
      <PopupContent />
    </PopupWithSigner>
  );
}
