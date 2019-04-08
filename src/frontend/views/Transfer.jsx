import React, {Component} from "react";
import styled from "styled-components";
import {InputField} from "./design-components/Inputs.js";
import Button from "./design-components/Button.js";
import secp256k1 from "secp256k1";
import {Web3Context} from '../contexts/Web3Context';
import {getDomain} from "../../helpers/getDomain.mjs";

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
  constructor() {
    super();
    this.state = {
      tokenAddress: null,
      signature: null,
      from: null,
      to: null,
      value: null,
      fee: null,
      nonce: null,
      privateKey: null
    }
  }

  componentDidMount() {
    this.setState({
      fee: 5,
      nonce: 0
      // testing purposes
      ,
      value: 400,
      from: '0x9ea02Ac11419806aB9d5A512c7d79AC422cB36F7',
      to: '0xB5227F13682873884a8C394A4a7AcDf369199Dc5',
      privateKey: '3d63b5b61cc9636a143f4d2c56a9609eb459bc2f8f168e448b65f218893fef9f'
    })
  }

  handleInput(stateKey, e) {
    this.setState({[stateKey]: e.target.value})
  }

  signTransactionData(web3Context) {
    let nonce = Date.now();
    // transferPreSignedHashing from Utils.sol
    // function transferPreSignedHashing(address _token, address _to, uint256 _value, uint256 _fee, uint256 _nonce)
    //   return keccak256(abi.encode(bytes4(0x15420b71), _token, _to, _value, _fee, _nonce));
    let input = web3Context.web3.eth.abi.encodeParameters(
      ['bytes4', 'address', 'address', 'uint256', 'uint256', 'uint256'],
      ['0x15420b71',
        web3Context.tokenContract.options.address,
        this.state.to,
        this.state.value.toString(),
        this.state.fee.toString(),
        nonce.toString()]);
    console.log(input);

    let inputHash = web3Context.web3.utils.keccak256(input);
    let privateKey;
    if (this.state.privateKey.substring(0, 2) === "0x")
      privateKey = this.state.privateKey.substring(2);
    else
      privateKey = this.state.privateKey;


    const signObj = secp256k1.sign(
      Buffer.from(inputHash.substring(2), "hex"),
      // 3d63b5b61cc9636a143f4d2c56a9609eb459bc2f8f168e448b65f218893fef9f
      Buffer.from(privateKey, "hex")
    );
    console.log(signObj);

    let signatureInHex = "0x" + signObj.signature.toString('hex') + (signObj.recovery + 27).toString(16);

    this.setState({
      signature: signatureInHex,
      nonce,
      tokenAddress: web3Context.tokenContract.options.address
    });
  }

  sendSignedTransaction() {
    console.log(this.state);

    fetch(`${getDomain()}/api/transfer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    });
  }

  render() {
    return (
      <Web3Context.Consumer>
        {web3Context => {
          return (
            <Container>
              <TitleRow>
                <Title>Transfer tokens</Title>
              </TitleRow>
              <FormContainer>
                <RowCentered>
                  <LeftComponent>
                    <AmountInput
                      placeholder={"Amount"}
                      value={this.state.value}
                      onChange={e => this.handleInput('value', e)}
                    />
                  </LeftComponent>
                  DOS tokens
                </RowCentered>
                <RowCentered>
                  <LeftComponent>
                    From:
                  </LeftComponent>
                  <AddressInputField
                    placeholder={"From Address"}
                    value={this.state.from}
                    onChange={e => this.handleInput('from', e)}
                  />
                </RowCentered>
                <RowCentered>
                  <LeftComponent>
                    To:
                  </LeftComponent>
                  <AddressInputField
                    placeholder={"To Address"}
                    value={this.state.to}
                    onChange={e => this.handleInput('to', e)}
                  />
                </RowCentered>
                <Row>
                  <LeftComponent>
                    transaction costs:
                  </LeftComponent>
                  <AmountContainer>
                    <div>
                      <Fee>
                        {this.state.fee}
                      </Fee> DOS
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
                    placeholder={"Private key of the from address"}
                    value={this.state.privateKey}
                    onChange={e => this.handleInput('privateKey', e)}
                  />
                  <PrivateKeyInfo>
                    Your private key is only used to sign the entered transation data. It is neither stored nor send
                    somewhere.
                  </PrivateKeyInfo>
                </RowMultiLines>
                <Button
                  onClick={async () => {
                    console.log(this.state);
                    await this.signTransactionData(web3Context);
                    this.sendSignedTransaction();
                  }}>
                  Send
                </Button>
              </FormContainer>
            </Container>
          );
        }}
      </Web3Context.Consumer>
    );
  }
}

export default Transfer;