const {
  insertReferendumWithExternal,
} = require("../../../../common/democracy/referendum/insert");
const {
  getDemocracyExternalUnFinished,
  updateDemocracyExternalByHash,
} = require("../../../../../mongo/service/onchain/democracyExternal");
const {
  business: {
    consts: {
      Modules,
      ReferendumEvents,
      DemocracyExternalStates,
      TimelineItemTypes,
    },
  },
} = require("@subsquare/scan-common");
const { getTechCommMotionCollection } = require("../../../../../mongo");

async function handleBusinessWhenTechCommMotionExecuted(
  motionHash,
  indexer,
  blockEvents
) {
  const col = await getTechCommMotionCollection();
  const motion = await col.findOne({ hash: motionHash, isFinal: false });
  if (!motion) {
    throw new Error(
      `Not found executed tech.comm. motion:${motionHash} in DB at height ${indexer.blockHeight}`
    );
  }

  const { externalProposals, proposal } = motion;
  if ((externalProposals || []).length <= 0) {
    return;
  }

  if (!hasReferendumStarted(blockEvents)) {
    throw new Error(
      "Tech. Comm. motion to fastTrack not table externalProposal"
    );
  }

  const { hash: externalProposalHash } = externalProposals[0];
  const referendumStartedEvent = blockEvents.find(
    ({ event }) =>
      event.section === Modules.Democracy &&
      event.method === ReferendumEvents.Started
  );

  const externalState = {
    indexer,
    state: DemocracyExternalStates.Tabled,
  };

  const timelineItem = {
    type: TimelineItemTypes.extrinsic,
    method: proposal.method,
    args: proposal.args,
    indexer,
  };

  const external = await getDemocracyExternalUnFinished(externalProposalHash);
  await insertReferendumWithExternal(
    referendumStartedEvent.event,
    indexer,
    externalProposalHash,
    external.indexer
  );

  await updateDemocracyExternalByHash(
    externalProposalHash,
    {
      state: externalState,
      isFinal: true,
    },
    timelineItem
  );
}

function hasReferendumStarted(events) {
  return events.some(({ event: e }) => {
    return (
      e.section === Modules.Democracy && e.method === ReferendumEvents.Started
    );
  });
}

module.exports = {
  handleBusinessWhenTechCommMotionExecuted,
};
