import React, {Component} from "react";
import styled from "styled-components";
import {InputField} from "./design-components/Inputs.js";
import Button from "./design-components/Button.js";
import secp256k1 from "secp256k1";
import {Web3Context} from '../contexts/Web3Context';
import {getDomain} from "../../helpers/getDomain.mjs";
import {withRouter} from 'react-router-dom';
import Select from 'react-select';
import {__GRAY_200, __THIRD} from "../helpers/colors.js";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 512px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 20px;
`;

const TitleRow = styled(Row)`
  flex: 1;
  font-weight: bold;
`;

const RowCentered = styled(Row)`
  align-items: center;    //vertical  alignment
`;

const LeftComponent = styled.div`
  width: 18%;
  margin-right: 10px;
`;

const AmountInput = styled(InputField)`
  margin-right: 10px;
`;

const AddressInputField = styled(InputField)`
  width: 100%;
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

const WideButton = styled(Button)`
  margin-top: 35px;
  ${props => !props.disabled ? '' : `
    opacity: 0.4
  `}
`;

const CustomSelect = styled(Select)`
  width: 100%;
  &:focus {
    box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
  }
  transition: box-shadow 0.15s ease;
  box-shadow: 0 1px 3px rgba(50, 50, 93, 0.15), 0 1px 0 rgba(0, 0, 0, 0.02);
`;

class TransferAndCall extends Component {
  constructor() {
    super();
    this.state = {
      // validators
      isFromValid: null,
      isToValid: null,
      isValueValid: null,

      // transfer data
      tokenAddress: null,
      signature: null,
      from: "",
      to: "",
      value: 0,
      fee: null,
      nonce: null,

      // call data
      methods: [],
      selectedMethod: null,
      callParameters: [],
      callParametersEncoded: null,

      // sign data
      privateKey: ""
    }
  }

  componentDidMount() {
    let methods = [];
    this.context.serviceContract._jsonInterface.forEach(e => {
      if (e.type === "function" && e.constant === false)
        methods.push({
          value: e,
          label: e.name
        });
    });
    this.setState({
      fee: 5,
      nonce: 0
      // testing purposes
      ,
      value: 400,
      isValueValid: true,
      from: '0x9ea02Ac11419806aB9d5A512c7d79AC422cB36F7',
      isFromValid: true,
      to: '0xB5227F13682873884a8C394A4a7AcDf369199Dc5',
      isToValid: true,
      privateKey: '3d63b5b61cc9636a143f4d2c56a9609eb459bc2f8f168e448b65f218893fef9f',
      methods,
      selectedMethod: methods[4],
      callParameters: methods[4].value.inputs
    })
  }

  handleInput(stateKey, e) {
    this.setState({[stateKey]: e.target.value})
  }

  validateAddress(stateKey, e) {
    if (this.context.web3.utils.isAddress(e.target.value)) {
      this.setState({[stateKey]: true});
    } else {
      this.setState({[stateKey]: false});
    }
  }

  isServiceContractAddress(e) {
    //TODO access context and more than one service contract

    if (this.context.serviceContract && this.context.serviceContract.options && this.context.serviceContract.options.address && e.target.value)
      return this.context.serviceContract.options.address === e.target.value;
    return false;
  }

  signTransactionData() {

    let callParametersEncoded = this.context.web3.eth.abi.encodeParameters(
      this.state.callParameters.map(e => {
        return e.type
      }),
      [10000, this.context.web3.utils.utf8ToHex('Hello world')]
    );
    this.setState({callParametersEncoded});

    let nonce = Date.now();
    // transferPreSignedHashing from Utils.sol
    // function transferPreSignedHashing(address _token, address _to, uint256 _value, uint256 _fee, uint256 _nonce)
    //   return keccak256(abi.encode(bytes4(0x15420b71), _token, _to, _value, _fee, _nonce));
    let input = this.context.web3.eth.abi.encodeParameters(
      ['bytes4', 'address', 'address', 'uint256', 'uint256', 'uint256', "bytes4", "bytes"],
      [
        '0x38980f82',
        this.context.tokenContract.options.address,
        this.state.to,
        this.state.value.toString(),
        this.state.fee.toString(),
        nonce.toString(),

        // call parameters
        this.state.selectedMethod.value.signature,
        callParametersEncoded
      ]);
    console.log('input: ' + input);

    let inputHash = this.context.web3.utils.keccak256(input);
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
      tokenAddress: this.context.tokenContract.options.address
    });
  }

  sendSignedTransaction() {

    let transactionObject = {
      tokenAddress: this.state.tokenAddress,
      signature: this.state.signature,
      from: this.state.from,
      to: this.state.to,
      value: this.state.value,
      fee: this.state.fee,
      nonce: this.state.nonce,
      methodName: this.state.selectedMethod.value.signature,
      callParametersEncoded: this.state.callParametersEncoded
    };

    console.log("sending this object: ", transactionObject);

    fetch(`${getDomain()}/api/transferAndCall`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(transactionObject)
    })
      .then(response => response.json())
      .then(response => {
        console.log(response);
      })
      .catch(err => {
        console.log("something went wrong: ", err)
      });
  }

  handleChange(selectedMethod) {
    this.setState({
      selectedMethod,
      callParameters: selectedMethod.value.inputs
    });
  }

  handleParameterInput(index, e) {
    let parameters = this.state.callParameters;
    parameters[index].value = e.target.value;
    this.setState({callParameters: parameters});
  }

  render() {
    return (
      <Container>
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
              onChange={e => {
                this.handleInput('from', e);
                this.validateAddress('isFromValid', e);
              }}
            />
          </RowCentered>
          <RowCentered>
            <LeftComponent>
              To:
            </LeftComponent>
            <AddressInputField
              placeholder={"To Address"}
              value={this.state.to}
              onChange={e => {
                this.handleInput('to', e);
                this.validateAddress('isToValid', e);
              }}
            />
          </RowCentered>
          <RowCentered>
            <LeftComponent>
              Contract Name:
            </LeftComponent>
            EUREKA Platform
          </RowCentered>

          <RowCentered>
            <LeftComponent>
              Contract Function:
            </LeftComponent>
            <CustomSelect
              className="basic-single"
              classNamePrefix="select"
              // defaultValue={this.state.selectedMethod}
              value={this.state.selectedMethod}
              onChange={e => this.handleChange(e)}
              isDisabled={false}
              isLoading={false}
              isClearable={false}
              isRtl={false}
              isSearchable={true}
              name="Method name"
              options={this.state.methods}
              styles={{
                control: styles => ({
                  ...styles, backgroundColor: 'white',
                  // lineHeight: 1.5,
                  // padding: "0.625rem 0.75rem",
                  borderRadius: "0.25rem",
                  transition: "box-shadow 0.15s ease",
                  boxShadow: "0 1px 3px rgba(50, 50, 93, 0.15), 0 1px 0 rgba(0, 0, 0, 0.02)",
                  color: __THIRD,
                  borderColor: __GRAY_200,
                  border: "1px solid " + __GRAY_200
                }),
                // option: (styles, {data, isDisabled, isFocused, isSelected}) => {
                //   const color = chroma(data.color);
                //   return {
                //     ...styles,
                //     backgroundColor: isDisabled
                //       ? null
                //       : isSelected ? data.color : isFocused ? color.alpha(0.1).css() : null,
                //     color: isDisabled
                //       ? '#ccc'
                //       : isSelected
                //         ? chroma.contrast(color, 'white') > 2 ? 'white' : 'black'
                //         : data.color,
                //     cursor: isDisabled ? 'not-allowed' : 'default',
                //
                //     ':active': {
                //       ...styles[':active'],
                //       backgroundColor: !isDisabled && (isSelected ? data.color : color.alpha(0.3).css()),
                //     },
                //   };
                // },
                input: styles => ({...styles, fontColor: __THIRD}),
                // placeholder: styles => ({...styles, ...dot()}),
                singleValue: (styles, {data}) => ({...styles, color: __THIRD}),
              }}
            />
            <Row>Method Parameters</Row>
          </RowCentered>
          {this.state.callParameters.length !== 0
            ? (
              <RowMultiLines>
                <TitleRow>Method Parameters</TitleRow>
                {this.state.callParameters.map((param, index) => {
                  return (
                    <RowCentered key={"parameter"+index}>
                      <LeftComponent>
                        {param.name}
                      </LeftComponent>
                      <AddressInputField
                        placeholder={param.type === "bytes32" ? "bytes32 or string" : param.type}
                        value={param.value}
                        onChange={e => {
                          this.handleParameterInput(index, e);
                        }}
                      />
                    </RowCentered>
                  );
                })}
              </RowMultiLines>
            )
            : null}
          <Row>
            <LeftComponent>
              Transaction costs:
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
          <WideButton
            disabled={!(this.state.isValueValid && this.state.isToValid && this.state.isFromValid)}
            onClick={async () => {
              console.log(this.state.isToValid)
              await this.signTransactionData();
              this.sendSignedTransaction();
            }}>
            Send
          </WideButton>
        </FormContainer>
      </Container>
    );
  }
}

TransferAndCall.contextType = Web3Context;

export default withRouter(TransferAndCall);