import React, { Component } from "react";
import styled from "styled-components";
import {InputField} from "./design-components/Inputs.js";
import Button from "./design-components/Button.js";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-family: "Indie Flower", cursive;
  font-size: 38px;
`;

const FormContainer = styled.div`

`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 20px;
`;

const RowCentered = styled(Row)`
  align-items: center;    //vertical  alignment
`;

const TitleRow = styled(RowCentered)`
  margin-top: 20px;
`;

const LeftComponent = styled.div`
  width: 160px;
  margin-right: 10px;
`;

const AmountInput = styled(InputField)`
  width: 150px;
  margin-right: 10px;
`;

const AddressInputField = styled(InputField)`
  width: 370px  ;
`;

const AmountContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Fee = styled.span`
  font-style: italic;
  margin-left: 5px;
  margin-right: 5px;
`;

const Padded = styled.div`
  padding-left: 8px;
`;

const PKInputField = styled(InputField)`
  width: 540px;
`;

const PrivateKeyInfo = styled.div`
  font-style: italic;
  margin-left: 10px;
  font-size: 10px;
  line-height: 1.6;
  margin-top: 3px;
`;

const RowMultiLines = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`;

class Transfer extends Component {
  render() {
    return (
      <Container>
        <TitleRow>
            <Title>Transfer tokens</Title>
        </TitleRow>
        <FormContainer>
          <RowCentered>
            <LeftComponent>
            <AmountInput
              placeholder={"Amount"}/>
            </LeftComponent>
            DOS tokens
          </RowCentered>
          <RowCentered>
            <LeftComponent>
              From:
            </LeftComponent>
            <AddressInputField
              placeholder={"From Address"}/>
          </RowCentered>
          <RowCentered>
            <LeftComponent>
              To:
            </LeftComponent>
            <AddressInputField
              placeholder={"To Address"}/>
          </RowCentered>
          <Row>
            <LeftComponent>
            transaction costs:
            </LeftComponent>
            <AmountContainer>
              <div>
                <Fee>5</Fee> DOS
              </div>
              <Padded>
                {'≈'}<Fee>0.20</Fee> ETH
              </Padded>
              <Padded>
                {'≈'}<Fee>0.20</Fee> USD
              </Padded>
            </AmountContainer>
          </Row>
          <RowMultiLines>
            <PKInputField
              placeholder={"Private key of the from address"}/>
            <PrivateKeyInfo>
              Your private key is only used to sign the entered transation data. It is neither stored nor send somewhere.
            </PrivateKeyInfo>
          </RowMultiLines>
          <Button>
            Send
          </Button>
        </FormContainer>
      </Container>
    );
  }
}

export default Transfer;