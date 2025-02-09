import React, { Fragment, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import useOnClickOutside from "../../utils/hooks/useOnClickOutside.js";
import useWindowSize from "../../utils/hooks/useWindowSize.js";
import Relative from "../styled/relative";
import Flex from "../styled/flex";
import { useIsLoggedIn, useUser } from "../../context/user";
import useIsMounted from "../../utils/hooks/useIsMounted";
import PrimaryButton from "../buttons/primaryButton.js";
import { useLoginPopup } from "next-common/hooks/useLoginPopup.js";
import GhostButton from "../buttons/ghostButton.js";
import { SystemProfile } from "@osn/icons/subsquare";
import { useConnectedAccountContext } from "next-common/context/connectedAccount/index.js";
import { SystemUser, AddressUser } from "../user";
import { useAccountMenu } from "./useAccountMenu.js";

const Wrapper = Relative;

const Menu = styled.div`
  border-radius: 8px;
  position: absolute;
  right: 0;
  margin-top: 4px;
  padding: 8px;
  z-index: 999999;
  background: var(--neutral100);
  border-width: 1px;
  border-style: solid;
  border-color: var(--neutral300);
  color: var(--textPrimary);
  box-shadow: var(--shadow200);
`;

const Item = styled(Flex)`
  min-width: 160px;
  cursor: pointer;
  padding: 0 12px;
  height: 36px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  :hover {
    background: var(--neutral200);
  }
  color: var(--textPrimary);

  > :not(:first-child) {
    margin-left: 8px;
  }
`;

function ProfileMenuItem({ onClick }) {
  return (
    <Item onClick={onClick}>
      <SystemProfile className="[&_path]:fill-textSecondary" />
      <span>Profile</span>
    </Item>
  );
}

export default function HeaderAccount() {
  const user = useUser();
  const isLoggedIn = useIsLoggedIn();
  const { disconnect: disconnectAccount } = useConnectedAccountContext();
  const router = useRouter();
  const [show, setShow] = useState(false);
  const ref = useRef();
  const windowSize = useWindowSize();
  const isMounted = useIsMounted();
  const { openLoginPopup } = useLoginPopup();
  const menu = useAccountMenu();

  useOnClickOutside(ref, () => setShow(false));

  useEffect(() => {
    if (windowSize.width && windowSize.width <= 600) {
      setShow(false);
    }
  }, [windowSize]);

  const handleAccountMenu = async (item) => {
    if (item.value === "logout") {
      await disconnectAccount();
    } else if (item.pathname) {
      await router.push(item.pathname);
    }

    if (isMounted.current) {
      setShow(false);
    }
  };

  const openUserProfile = () => {
    router.push(`/user/${user.address}`);
  };

  let connectBtn = (
    <PrimaryButton onClick={() => openLoginPopup()}>Connect</PrimaryButton>
  );
  if (user) {
    if (isLoggedIn) {
      connectBtn = (
        <GhostButton onClick={() => setShow(!show)}>
          <SystemUser user={user} noEvent />
        </GhostButton>
      );
    } else {
      connectBtn = (
        <GhostButton onClick={() => setShow(!show)}>
          <AddressUser add={user?.address} noEvent />
        </GhostButton>
      );
    }
  }

  return (
    <>
      <Wrapper ref={ref}>
        {connectBtn}

        {show && (
          <Menu>
            {user?.address && <ProfileMenuItem onClick={openUserProfile} />}
            {menu?.map((item, index) => (
              <Fragment key={index}>
                <Item onClick={() => handleAccountMenu(item)}>
                  {item.icon}
                  <span>{item.name}</span>
                </Item>
              </Fragment>
            ))}
          </Menu>
        )}
      </Wrapper>
    </>
  );
}
