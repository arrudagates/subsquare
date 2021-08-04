import styled from "styled-components";
import Link from "next/link";
import { useState } from "react";

import Layout from "components/layout";
import Agreement from "components/agreement";
import Button from "components/button";
import Input from "components/input";
import AddressSelect from "components/addressSelect";

const Wrapper = styled.div`
  padding: 32px 0 6px;
  min-height: calc(100vh - 64px - 26px - 26px);
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ContentWrapper = styled.div`
  background: #ffffff;
  border: 1px solid #ebeef4;
  box-shadow: 0px 6px 7px rgba(30, 33, 52, 0.02),
    0px 1.34018px 1.56354px rgba(30, 33, 52, 0.0119221),
    0px 0.399006px 0.465507px rgba(30, 33, 52, 0.00807786);
  border-radius: 6px;
  width: 360px;
  margin: 0 auto;
  padding: 48px;
  > :not(:first-child) {
    margin-top: 24px;
  }
  @media screen and (max-width: 392px) {
    width: 100%;
  }
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 20px;
  text-align: center;
`;

const ButtonWrapper = styled.div`
  > :not(:first-child) {
    margin-top: 12px;
  }
`;

const LinkWrapper = styled.div`
  color: #506176;
  text-align: center;
  a {
    font-weight: bold;
    color: #6848ff;
  }
`;

const InputWrapper = styled.div``;

const Label = styled.div`
  font-weight: bold;
  font-size: 12px;
  margin-bottom: 8px;
  :not(:first-child) {
    margin-top: 16px;
  }
`;

const ForgetPassword = styled.div`
  margin-top: 8px;
  color: #9da9bb;
  font-size: 12px;
`;

const InfoWrapper = styled.div`
  padding: 12px 16px;
  background: #f6f7fa;
  border-radius: 4px;
  line-height: 150%;
  color: #506176;
`;

const Redirect = styled.div`
  text-align: center;
  color: #506176;
  .sec {
    font-weight: bold;
    color: #6848ff;
  }
`;

export default function Signup() {
  const [success, setSuccess] = useState(false);
  const [web3, setWeb3] = useState(false);

  return (
    <Layout>
      <Wrapper>
        {!success && (
          <ContentWrapper>
            <Title>Signup</Title>
            {!web3 && (
              <>
                <InputWrapper>
                  <Label>Username</Label>
                  <Input placeholder="Please fill your name" />
                  <Label>Email</Label>
                  <Input placeholder="Please fill email" />
                  <Label>Password</Label>
                  <Input placeholder="Please fill password" type="password" />
                  <ForgetPassword>
                    <Link href="forget">Forget password?</Link>
                  </ForgetPassword>
                </InputWrapper>
                <ButtonWrapper>
                  <Button isFill secondary onClick={() => setSuccess(true)}>
                    Sign up
                  </Button>
                  <Button isFill onClick={() => setWeb3(true)}>
                    Sign up with web3 address
                  </Button>
                </ButtonWrapper>
              </>
            )}
            {web3 && (
              <>
                <div>
                  <Label>Choose linked address</Label>
                  <AddressSelect />
                </div>
                <ButtonWrapper>
                  <Button isFill secondary onClick={() => setSuccess(true)}>
                    Sign up
                  </Button>
                  <Button isFill onClick={() => setWeb3(false)}>
                    Sign up with username
                  </Button>
                </ButtonWrapper>
              </>
            )}
            <LinkWrapper>
              Already have a account? <Link href="/login">Login</Link>
            </LinkWrapper>
          </ContentWrapper>
        )}
        {success && (
          <ContentWrapper>
            <Title>Congrats</Title>
            <InfoWrapper>
              We sent you an email to verify your address. Click on the link in
              the email.
            </InfoWrapper>
            <Button isFill secondary onClick={() => setSuccess(false)}>
              Got it
            </Button>
            <Redirect>
              The page will be re-directed in <span className="sec">3s</span>
            </Redirect>
          </ContentWrapper>
        )}
        <Agreement />
      </Wrapper>
    </Layout>
  );
}
