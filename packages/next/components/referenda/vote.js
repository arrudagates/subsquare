import { memo, useState } from "react";
import dynamic from "next/dynamic";
import styled from "styled-components";
import Loading from "next-common/components/loading";
import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { useSelector } from "react-redux";
import {
  electorateSelector,
  isLoadingElectorateSelector,
} from "next-common/store/reducers/referendumSlice";
import SubLink from "next-common/components/styled/subLink";
import VoteBar from "next-common/components/referenda/voteBar";
import TallyInfo from "next-common/components/referenda/tally/info";
import MyVote from "./myVote";
import PrimaryButton from "next-common/components/buttons/primaryButton";
import NestedVotesPopup from "next-common/components/democracy/nestedVotesPopup";
import useIsDemocracyPassing from "next-common/context/post/democracy/referendum/passing";
import useIsDemocracyVoteFinished from "next-common/context/post/democracy/referendum/isVoteFinished";
import useDemocracyThreshold from "next-common/context/post/democracy/referendum/threshold";
import useIsDemocracyPassed from "next-common/context/post/democracy/referendum/result";
import useLatestDemocracyTally from "next-common/hooks/democracy/tally";
import { useChainSettings } from "next-common/context/chain";
import Calls from "./voteCalls";
import isMoonChain from "next-common/utils/isMoonChain";
import { RightBarWrapper } from "next-common/components/layout/sidebar/rightBarWrapper";
import WithAddress from "next-common/components/common/withAddress";
import useIsUseMetamask from "next-common/hooks/useIsUseMetamask";
import { VoteSuccessfulProvider } from "next-common/components/vote";
import VoteSuccessfulPopup from "components/gov2/votePopup/voteSuccessful";

const VotePopup = dynamic(() => import("components/referenda/popup"), {
  ssr: false,
});

const MoonVotePopup = dynamic(
  () => import("components/referenda/popup/moonPopup"),
  {
    ssr: false,
  },
);

const FlattenedVotesPopup = dynamic(
  () => import("next-common/components/democracy/flattenedVotesPopup"),
  {
    ssr: false,
  },
);

const Title = styled(TitleContainer)`
  margin-bottom: 16px;
`;

const Status = styled.div`
  margin-top: 8px !important;
  width: 100%;
  line-height: 38px;
  border-width: 0;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 700;
  cursor: default;
  text-align: center;
`;

const PassStatus = styled(Status)`
  color: var(--green500);
  background: var(--green100);
`;

const RejectStatus = styled(Status)`
  color: var(--red500);
  background: var(--red100);
`;

function Vote({ referendumIndex }) {
  const [showVote, setShowVote] = useState(false);
  const [showFlattenedVotesList, setShowFlattenedVotesList] = useState(false);
  const [showNestedVotesList, setShowNestedVotesList] = useState(false);
  const tally = useLatestDemocracyTally();
  const isPassing = useIsDemocracyPassing(tally);
  const threshold = useDemocracyThreshold();
  const isPassed = useIsDemocracyPassed();
  const { useVoteCall, hideActionButtons } = useChainSettings();

  const isElectorateLoading = useSelector(isLoadingElectorateSelector);
  const electorate = useSelector(electorateSelector);

  const isVoteFinished = useIsDemocracyVoteFinished();
  const isUseMetamask = useIsUseMetamask();

  let Popup = VotePopup;
  if (isMoonChain() && isUseMetamask) {
    Popup = MoonVotePopup;
  }

  let finishedResult;
  if (isVoteFinished) {
    finishedResult = isPassed ? (
      <PassStatus>Passed</PassStatus>
    ) : (
      <RejectStatus>Failed</RejectStatus>
    );
  }

  return (
    <RightBarWrapper>
      <SecondaryCardDetail>
        <Title className="!px-0">
          <span>Votes</span>
          <div>{isElectorateLoading ? <Loading size={16} /> : null}</div>
        </Title>

        <VoteBar tally={tally} electorate={electorate} threshold={threshold} />
        <TallyInfo tally={tally} />

        {finishedResult}
        {!isVoteFinished &&
          (isPassing ? (
            <PassStatus>Passing</PassStatus>
          ) : (
            <RejectStatus>Failing</RejectStatus>
          ))}

        <div className="flex items-center justify-between mt-4">
          <div className="text12Medium text-textPrimary">Votes</div>
          <div className="flex items-center gap-x-3">
            <SubLink onClick={() => setShowNestedVotesList(true)}>
              Nested
            </SubLink>
            <SubLink onClick={() => setShowFlattenedVotesList(true)}>
              Flattened
            </SubLink>
            {useVoteCall && <Calls />}
          </div>
        </div>
      </SecondaryCardDetail>

      <WithAddress>
        <MyVote />
      </WithAddress>

      {!isVoteFinished && !hideActionButtons && (
        <PrimaryButton
          onClick={() => {
            setShowVote(true);
          }}
        >
          Vote
        </PrimaryButton>
      )}

      <VoteSuccessfulProvider VoteSuccessfulPopup={VoteSuccessfulPopup}>
        {showVote && (
          <Popup
            onClose={() => setShowVote(false)}
            referendumIndex={referendumIndex}
          />
        )}
      </VoteSuccessfulProvider>
      {showFlattenedVotesList && (
        <FlattenedVotesPopup setShowVoteList={setShowFlattenedVotesList} />
      )}
      {showNestedVotesList && (
        <NestedVotesPopup setShowVoteList={setShowNestedVotesList} />
      )}
    </RightBarWrapper>
  );
}

export default memo(Vote);
