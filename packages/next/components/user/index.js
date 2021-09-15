import styled, { css } from "styled-components";
import Identity from "./identity";
import { fetchIdentity } from "services/identity";
import { useEffect, useState } from "react";
import { encodeAddressToChain } from "services/address";
import { nodes } from "utils/constants";
import Avatar from "components/avatar";
import Grvatar from "components/gravatar";
import { addressEllipsis } from "../../utils";
import ExternalLink from "../externalLink";

const Wrapper = styled.div`
  display: flex;
  align-items: center;

  a {
    &:hover {
      text-decoration: underline;
    }
  }
  ${(p) =>
    p.noEvent &&
    css`
      pointer-events: none;
    `}
`;

const AvatarWrapper = styled.div`
  display: flex;
  margin-right: 8px;
`;

const Username = styled.span`
  font-weight: 500;
  word-break: break-all;
  font-size: ${(props) => props.fontSize}px;
`;

export default function User({
  user,
  chain,
  add,
  showAvatar = true,
  fontSize = 14,
  noEvent = false,
}) {
  if (!user && !add) {
    return <Username fontSize={fontSize}>[Deleted Account]</Username>;
  }
  const [identity, setIdentity] = useState(null);

  const address =
    add ?? user?.addresses?.find((addr) => addr.chain === chain)?.address;

  useEffect(() => {
    setIdentity(null);
    if (address) {
      const relayChain = nodes.find((n) => n.value === chain)?.relay;
      if (!relayChain) return;

      fetchIdentity(relayChain, encodeAddressToChain(address, relayChain)).then(
        (identity) => setIdentity(identity)
      );
    }
  }, [address]);

  return (
    <Wrapper noEvent={noEvent}>
      {showAvatar && (
        <AvatarWrapper>
          {address ? (
            <Avatar address={address} size={20} />
          ) : (
            <Grvatar email={user?.email} emailMd5={user?.emailMd5} size={20} />
          )}
        </AvatarWrapper>
      )}
      <ExternalLink href={`https://${chain}.subscan.io/account/${address}`}>
        {identity ? (
          <Identity identity={identity} fontSize={fontSize} />
        ) : (
          <Username fontSize={fontSize}>
            {user?.username ?? addressEllipsis(add)}
          </Username>
        )}
      </ExternalLink>
    </Wrapper>
  );
}
