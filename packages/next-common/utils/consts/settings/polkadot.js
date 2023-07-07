import Logo from "../../../assets/header-logos/polkadot.svg";
import DarkModeLogo from "../../../assets/header-logos/polkadot-dark.svg";
import Avatar from "../../../assets/icons/chain/polkadot.png";

import capitalize from "../../capitalize";
import Chains from "../chains";
import MenuGroups from "./menuGroups";
import { defaultPostLabels } from "./common";
import {
  ProjectLogoPolkadotDark,
  ProjectLogoPolkadotLight,
} from "@osn/icons/subsquare";

const name = Chains.polkadot;

export const defaultPolkadotNodes = [
  {
    name: "Parity",
    url: "wss://rpc.polkadot.io",
  },
  {
    name: "OnFinality",
    url: "wss://polkadot.api.onfinality.io/public-ws",
  },
  {
    name: "Dwellir",
    url: "wss://polkadot-rpc.dwellir.com",
  },
  {
    name: "Dwellir Tunisia",
    url: "wss://polkadot-rpc-tn.dwellir.com",
  },
  {
    name: "Automata 1RPC",
    url: "wss://1rpc.io/dot",
  },
  {
    name: "IBP-GeoDNS1",
    url: "wss://rpc.ibp.network/polkadot",
  },
  {
    name: "IBP-GeoDNS2",
    url: "wss://rpc.dotters.network/polkadot",
  },
  {
    name: "RadiumBlock",
    url: "wss://polkadot.public.curie.radiumblock.co/ws",
  },
];

const links = [
  {
    name: "website",
    url: "https://polkadot.network/",
  },
  {
    name: "twitter",
    url: "https://twitter.com/Polkadot",
  },
  {
    name: "reddit",
    url: "https://www.reddit.com/r/polkadot",
  },
  {
    name: "discord",
    url: "https://dot.li/discord",
  },
  {
    name: "github",
    url: "https://github.com/paritytech/polkadot/",
  },
  {
    name: "element",
    url: "https://matrix.to/#/#Polkadot-Direction:parity.io",
  },
];

const polkadot = {
  value: name,
  name: capitalize(name),
  identity: name,
  symbol: "DOT",
  decimals: 10,
  hasElections: true,
  ss58Format: 0,
  blockTime: 6000,
  snsCoverCid: "bafybeifsztkok4p4vzjbhacvr2o4dxc5xgb7ynxsgnvmicttpqce34xdwe",
  endpoints: defaultPolkadotNodes,
  headerLogo: Logo,
  darkHeaderLogo: DarkModeLogo,
  avatar: Avatar,
  navLogo: ProjectLogoPolkadotLight,
  navLogoDark: ProjectLogoPolkadotDark,
  group: MenuGroups.PolkadotAndParachains,
  links,
  postLabels: defaultPostLabels,
  hasReferenda: true,
  hasStatescan: true,
  hasSubscan: true,
  hasDotreasury: true,
  // used to control whether to show votes delegation percentage on referendum detail page.
  showReferendaReferendumDelegationPercentage: true,
  useVoteCall: true,
  showAchainableLabels: true,
  description: "Polkadot empowers blockchain networks to work together under the protection of shared security.",
  hideNewTreasuryProposalButton: true,
};

export default polkadot;
