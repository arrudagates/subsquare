import styled, { css } from "styled-components";

import ReplyIcon from "public/imgs/icons/reply.svg";
import ThumbUpIcon from "public/imgs/icons/thumb-up.svg";
import Edit from "components/edit";
import UnfoldIcon from "public/imgs/icons/unfold.svg";
import FoldIcon from "public/imgs/icons/fold.svg";

const Wrapper = styled.div`
  display: flex;
  margin-top: 16px;
  align-items: flex-start;
  height: 22px;
  flex-wrap: wrap;
`;

const Item = styled.div`
  cursor: default;

  ${(p) =>
    !p.noHover &&
    css`
      cursor: pointer;
      :hover {
        color: #506176;
        > svg {
          path {
            fill: #506176;
          }
        }
      }
    `}

  ${(p) =>
    p.highlight
      ? css`
          color: #506176;
          > svg {
            path {
              fill: #506176;
            }
          }
        `
      : css`
          color: #9da9bb;
          > svg {
            path {
              fill: #9da9bb;
            }
          }
        `}

display: flex;
  align-items: center;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 100%;

  :not(:first-child) {
    margin-left: 17px;
  }

  > svg {
    margin-right: 8px;
  }
`;

const UnfoldWrapper = styled(Item)`
  margin-left: 7px !important;
`;

export default function Actions({
  onReply,
  noHover,
  highlight,
  toggleThumbUp,
  count,
  edit,
  setIsEdit,
  showThumbsUpList,
  setShowThumbsUpList,
}) {
  return (
    <Wrapper>
      <Item
        onClick={() => {
          if (!noHover) {
            onReply && onReply();
          }
        }}
        noHover={noHover}
      >
        <ReplyIcon />
        <div>Reply</div>
      </Item>
      <Item
        noHover={noHover}
        highlight={highlight}
        onClick={() => toggleThumbUp && toggleThumbUp()}
      >
        <ThumbUpIcon />
        <div>Up ({count ?? 0})</div>
      </Item>
      {count > 0 && (
        <UnfoldWrapper onClick={() => setShowThumbsUpList(!showThumbsUpList)}>
          {showThumbsUpList ? <UnfoldIcon /> : <FoldIcon />}
        </UnfoldWrapper>
      )}
      {edit && <Edit edit={edit} setIsEdit={setIsEdit} alwaysShow />}
    </Wrapper>
  );
}
