import styled from "styled-components";

import User from "components/user";
import Progress from "./progress";

const TitleWrapper = styled.div`
  min-height: 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  > :last-child {
    display: flex;
    align-items: center;
    color: #506176;
    > img {
      margin-left: 4px;
    }
  }
`;

const ArgsWrapper = styled.div`
  margin: 4px 0;
  background: #f6f7fa;
  padding: 12px 28px;
  > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 28px;
    > :first-child {
      color: #506176;
      min-width: 120px;
    }
  }
`;

export default function Voting({ data, chain }) {
  return (
    <div>
      <TitleWrapper>
        <User chain={chain} add={data.proposer} fontSize={12} />
        <div>
          <div>{data.method}</div>
          <img src="/imgs/icons/approve.svg" />
        </div>
      </TitleWrapper>
      <ArgsWrapper>
        {
          data.args.map((item, index) => (
            <div key={index}>
              <div>{item.name}</div>
              <div>{
                item.type === "AccountId" ? (
                  <User chain={chain} add={item.value} fontSize={12} />
                ) : item.value.toString()
              }</div>
            </div>
          ))
        }
      </ArgsWrapper>
      <Progress total={data.total} ayes={data.ayes} nays={data.nays} />
    </div>
  );
}
