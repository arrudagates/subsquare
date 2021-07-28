const { GenericCall } = require("@polkadot/types");
const { createKeyMulti, encodeAddress } = require("@polkadot/util-crypto");
const { getApi } = require("../api");
const { logger } = require("../logger");

const treasuryProposalCouncilIndexes = ["0x1201", "0x1202"];
const approveProposalIndex = "0x1202";
const rejectProposalIndex = "0x1201";

function tryInitCall(registry, callHex) {
  try {
    return new GenericCall(registry, callHex);
  } catch (e) {
    logger.error(e.message, e.stack);
  }
}

async function getMultiSigExtrinsicAddress(args = {}, signer) {
  const { threshold, other_signatories: otherSignatories } = args;
  const api = await getApi();

  return calcMultisigAddress(
    [signer, ...otherSignatories],
    threshold,
    api.registry.chainSS58
  );
}

function calcMultisigAddress(signatories, threshold, chainSS58) {
  const multiPub = createKeyMulti(signatories, threshold);
  return encodeAddress(multiPub, chainSS58);
}

module.exports = {
  treasuryProposalCouncilIndexes,
  approveProposalIndex,
  rejectProposalIndex,
  getMultiSigExtrinsicAddress,
  calcMultisigAddress,
};
