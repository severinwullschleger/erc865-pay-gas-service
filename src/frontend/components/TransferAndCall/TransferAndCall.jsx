import React, { Component } from "react";
import styled from "styled-components";
import { InputField } from "../../views/design-components/Inputs.js";
import Button from "../../views/design-components/Button.js";
import secp256k1 from "secp256k1";
import { Web3Context } from "../../contexts/Web3Context.js";
import { getDomain } from "../../../helpers/getDomain.mjs";
import { withRouter } from "react-router-dom";
import Select from "react-select";
import { __GRAY_200, __THIRD } from "../../helpers/colors.js";
import { isServiceContractAddress } from "../../helpers/isServiceContractAddress.js";
import { upsertFromAddressesLocalStorage } from "../../helpers/saveUserAddressInLocalStorage.js";
import getEthereumAccounts from "../../../helpers/get-ethereum-accounts.mjs";
import web3, { web3Provider } from "../../../helpers/web3Instance.mjs";
import Web3Providers from "../../web3/Web3Providers.mjs";
import { callService } from "../Transfer/Transfer.jsx";

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
  align-items: center; //vertical  alignment
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

const PKInputField = styled(InputField)``;

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
  ${props =>
    !props.disabled
      ? ""
      : `
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
      isFromValid: true,
      isToValid: true,
      isValueValid: true,

      tokenContracts: [],
      selectedTokenContract: "",
      serviceContracts: [],
      selectedServiceContract: "",

      // transfer data
      signature: "",
      from: "",
      to: "",
      value: 0,
      nonce: 0,

      // call data
      methods: [],
      selectedMethod: "",
      callParameters: [],
      callParametersEncoded: "",

      // sign data
      privateKey: ""
    };
  }

  isCallableMethod(e) {
    return (
      e.type === "function" &&
      e.constant === false &&
      e.inputs.length >= 2 &&
      e.inputs[0].type === "address" &&
      e.inputs[1].type === "uint256"
    );
  }

  async componentDidMount() {
    let tokenContracts = this.context.tokenContracts.map((c, index) => {
      return {
        value: c,
        label: c.name,
        index
      };
    });
    let serviceContracts = this.context.serviceContracts.map((c, index) => {
      return {
        value: c,
        label: c.name,
        index
      };
    });
    let methods = [];
    this.context.serviceContracts[0].contractObj._jsonInterface.forEach(e => {
      if (this.isCallableMethod(e))
        methods.push({
          value: e,
          label: e.name
        });
    });

    if (!this.props.location.state) {
      this.setState({
        tokenContracts,
        selectedTokenContract: tokenContracts[0],
        serviceContracts,
        // selectedServiceContract: serviceContracts[0],
        nonce: 0,
        methods
      });
    } else {
      this.setState({
        tokenContracts,
        selectedTokenContract:
          tokenContracts[this.props.location.state.tokenContractIndex],
        serviceContracts,
        selectedServiceContract: this.props.location.state.to
          ? serviceContracts[
              serviceContracts.findIndex(item => {
                return (
                  item.value.contractObj.options.address ===
                  this.props.location.state.to
                );
              })
            ]
          : null,
        nonce: 0,
        value: this.props.location.state.value
          ? this.props.location.state.value
          : 0,
        isValueValid: this.props.location.state.isValueValid
          ? this.props.location.state.isValueValid
          : true,
        from: this.props.location.state.from
          ? this.props.location.state.from
          : web3Provider === Web3Providers.NO_PROVIDER
          ? ""
          : await getEthereumAccounts(web3).then(accounts => {
              return accounts[0];
            }),
        isFromValid: this.props.location.state.isFromValid
          ? this.props.location.state.isFromValid
          : true,
        to: this.props.location.state.to ? this.props.location.state.to : "",
        isToValid: this.props.location.state.isToValid
          ? this.props.location.state.isToValid
          : true,
        privateKey: this.props.location.state.privateKey
          ? this.props.location.state.privateKey
          : "",
        methods
      });
    }
  }

  handleInput(stateKey, e) {
    this.setState({ [stateKey]: e.target.value });
  }

  validateAddress(stateKey, address) {
    if (this.context.web3.utils.isAddress(address)) {
      this.setState({ [stateKey]: true });
    } else {
      this.setState({ [stateKey]: false });
    }
  }

  isServiceContractAddress(e) {
    //TODO access context and more than one service contract

    if (
      this.context.serviceContracts[0].contractObj &&
      this.context.serviceContracts[0].contractObj.options &&
      this.context.serviceContracts[0].contractObj.options.address &&
      e.target.value
    )
      return (
        this.context.serviceContracts[0].contractObj.options.address ===
        e.target.value
      );
    return false;
  }

  async signTransactionData() {
    let types = this.state.callParameters.map(e => {
      return e.type;
    });
    // we ignore the first two parameters of the service contract method since _from and _value are added by the token contract when the service contract is called.
    types.shift();
    types.shift();

    let values = this.state.callParameters.map(e => {
      if (e.type === "bytes32" && e.value) {
        if (!this.context.web3.utils.isHexStrict(e.value))
          return this.context.web3.utils.utf8ToHex(e.value);
      }
      return e.value;
    });
    // we ignore the first two parameters of the service contract method since _from and _value are added by the token contract when the service contract is called.
    values.shift();
    values.shift();

    let callParametersEncoded = this.context.web3.eth.abi.encodeParameters(
      types,
      values
    );
    this.setState({ callParametersEncoded });

    let nonce = Date.now();
    // transferPreSignedHashing from Utils.sol
    // function transferPreSignedHashing(address _token, address _to, uint256 _value, uint256 _fee, uint256 _nonce)
    //   return keccak256(abi.encode(bytes4(0x15420b71), _token, _to, _value, _fee, _nonce));
    let input = this.context.web3.eth.abi.encodeParameters(
      [
        "bytes4",
        "address",
        "address",
        "uint256",
        "uint256",
        "uint256",
        "bytes4",
        "bytes"
      ],
      [
        "0x38980f82",
        this.state.selectedTokenContract.value.contractObj.options.address,
        this.state.to,
        this.state.value.toString(),
        this.state.selectedTokenContract.value.feeTransferAndCall.toString(),
        nonce.toString(),

        // call parameters
        this.state.selectedMethod.value.signature,
        callParametersEncoded
      ]
    );
    console.log("input: " + input);

    let inputHash = this.context.web3.utils.keccak256(input);
    let privateKey;
    if (this.state.privateKey.substring(0, 2) === "0x")
      privateKey = this.state.privateKey.substring(2);
    else privateKey = this.state.privateKey;

    let signObj;
    if (this.state.selectedTokenContract.value.signMethod === "personalSign") {
      signObj = await web3.eth.personal.sign(
        inputHash.substring(2),
        // 3d63b5b61cc9636a143f4d2c56a9609eb459bc2f8f168e448b65f218893fef9f
        this.state.from
      );
    } else {
      signObj = secp256k1.sign(
        Buffer.from(inputHash.substring(2), "hex"),
        // 3d63b5b61cc9636a143f4d2c56a9609eb459bc2f8f168e448b65f218893fef9f
        Buffer.from(privateKey, "hex")
      );
    }
    console.log(signObj);

    let signatureInHex =
      "0x" +
      signObj.signature.toString("hex") +
      (signObj.recovery + 27).toString(16);

    this.setState({
      signature: signatureInHex,
      nonce
    });
  }

  sendSignedTransaction() {
    let transactionObject = {
      tokenContractIndex: this.state.selectedTokenContract.index,
      signature: this.state.signature,
      from: this.state.from,
      to: this.state.to,
      value: this.state.value,
      fee: this.state.selectedTokenContract.value.feeTransferAndCall,
      nonce: this.state.nonce,
      methodName: this.state.selectedMethod.value.signature,
      callParametersEncoded: this.state.callParametersEncoded
    };
    console.log("sending this object: ", transactionObject);
    callService("transferAndCall", transactionObject);
  }

  handleMethodChange(selectedMethod) {
    this.setState({
      selectedMethod,
      callParameters: selectedMethod.value.inputs
    });
  }

  handleTokenContractChange(selectedTokenContract) {
    this.setState({
      selectedTokenContract
    });
  }

  handleServiceContractChange(selectedServiceContract) {
    this.setState({
      selectedServiceContract,
      to: selectedServiceContract.value.contractObj.options.address
    });
    this.validateAddress(
      "isToValid",
      selectedServiceContract.value.contractObj.options.address
    );
  }

  changeServiceContractTo(value) {
    this.state.serviceContracts.forEach(c => {
      if (
        c.value.contractObj.options.address.toLowerCase() ===
        value.toLowerCase()
      )
        this.handleServiceContractChange(c);
    });
  }

  handleParameterInput(index, e) {
    let parameters = this.state.callParameters;
    parameters[index].value = e.target.value;
    this.setState({ callParameters: parameters });
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
                onChange={e => this.handleInput("value", e)}
              />
            </LeftComponent>
            <CustomSelect
              className="basic-single"
              classNamePrefix="select"
              // defaultValue={this.state.selectedMethod}
              value={this.state.selectedTokenContract}
              onChange={e => this.handleTokenContractChange(e)}
              isDisabled={false}
              isLoading={false}
              isClearable={false}
              isRtl={false}
              isSearchable={true}
              name="Token Contract"
              options={this.state.tokenContracts}
              styles={{
                control: styles => ({
                  ...styles,
                  backgroundColor: "white",
                  borderRadius: "0.25rem",
                  transition: "box-shadow 0.15s ease",
                  boxShadow:
                    "0 1px 3px rgba(50, 50, 93, 0.15), 0 1px 0 rgba(0, 0, 0, 0.02)",
                  color: __THIRD,
                  borderColor: __GRAY_200,
                  border: "1px solid " + __GRAY_200
                }),
                input: styles => ({ ...styles, fontColor: __THIRD }),
                singleValue: (styles, { data }) => ({
                  ...styles,
                  color: __THIRD
                })
              }}
            />
          </RowCentered>
          <RowCentered>
            <LeftComponent>From:</LeftComponent>
            <AddressInputField
              placeholder={"From Address"}
              value={this.state.from}
              onChange={e => {
                this.handleInput("from", e);
                this.validateAddress("isFromValid", e.target.value);
              }}
            />
          </RowCentered>
          <RowCentered>
            <LeftComponent>To:</LeftComponent>
            <AddressInputField
              placeholder={"To Address"}
              value={this.state.to}
              onChange={e => {
                this.handleInput("to", e);
                this.validateAddress("isToValid", e.target.value);
                if (
                  isServiceContractAddress(
                    this.context.serviceContracts,
                    e.target.value
                  )
                )
                  this.changeServiceContractTo(e.target.value);
                else this.setState({ selectedServiceContract: null });
              }}
            />
          </RowCentered>
          <RowCentered>
            <LeftComponent>Contract Name:</LeftComponent>
            <CustomSelect
              className="basic-single"
              classNamePrefix="select"
              // defaultValue={this.state.selectedMethod}
              value={this.state.selectedServiceContract}
              onChange={e => this.handleServiceContractChange(e)}
              isDisabled={false}
              isLoading={false}
              isClearable={false}
              isRtl={false}
              isSearchable={true}
              name="Service Contract"
              options={this.state.serviceContracts}
              styles={{
                control: styles => ({
                  ...styles,
                  backgroundColor: "white",
                  borderRadius: "0.25rem",
                  transition: "box-shadow 0.15s ease",
                  boxShadow:
                    "0 1px 3px rgba(50, 50, 93, 0.15), 0 1px 0 rgba(0, 0, 0, 0.02)",
                  color: __THIRD,
                  borderColor: __GRAY_200,
                  border: "1px solid " + __GRAY_200
                }),
                input: styles => ({ ...styles, fontColor: __THIRD }),
                singleValue: (styles, { data }) => ({
                  ...styles,
                  color: __THIRD
                })
              }}
            />
          </RowCentered>

          <RowCentered>
            <LeftComponent>Contract Function:</LeftComponent>
            <CustomSelect
              className="basic-single"
              classNamePrefix="select"
              // defaultValue={this.state.selectedMethod}
              value={this.state.selectedMethod}
              onChange={e => this.handleMethodChange(e)}
              isDisabled={false}
              isLoading={false}
              isClearable={false}
              isRtl={false}
              isSearchable={true}
              name="Method name"
              options={this.state.methods}
              styles={{
                control: styles => ({
                  ...styles,
                  backgroundColor: "white",
                  // lineHeight: 1.5,
                  // padding: "0.625rem 0.75rem",
                  borderRadius: "0.25rem",
                  transition: "box-shadow 0.15s ease",
                  boxShadow:
                    "0 1px 3px rgba(50, 50, 93, 0.15), 0 1px 0 rgba(0, 0, 0, 0.02)",
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
                input: styles => ({ ...styles, fontColor: __THIRD }),
                // placeholder: styles => ({...styles, ...dot()}),
                singleValue: (styles, { data }) => ({
                  ...styles,
                  color: __THIRD
                })
              }}
            />
          </RowCentered>
          {this.state.callParameters.length !== 0 ? (
            <RowMultiLines>
              <TitleRow>Method Parameters</TitleRow>
              {this.state.callParameters.map((param, index) => {
                if (index > 1)
                  return (
                    <RowCentered key={"parameter" + index}>
                      <LeftComponent>{param.name}</LeftComponent>
                      <AddressInputField
                        placeholder={
                          param.type === "bytes32"
                            ? "bytes32 or string"
                            : param.type
                        }
                        value={param.value}
                        onChange={e => {
                          this.handleParameterInput(index, e);
                        }}
                      />
                    </RowCentered>
                  );
                else return null;
              })}
            </RowMultiLines>
          ) : null}
          <Row>
            <LeftComponent>Transaction fee:</LeftComponent>
            <AmountContainer>
              <div>
                <Fee>
                  {this.state.selectedTokenContract &&
                    this.state.selectedTokenContract.value.feeTransferAndCall}
                </Fee>{" "}
                {this.state.selectedTokenContract &&
                  this.state.selectedTokenContract.value.symbol}
              </div>
              <Padded>
                {"≈"}
                <Fee>
                  {this.state.selectedTokenContract &&
                    this.state.selectedTokenContract.value.feeTransferAndCall *
                      this.state.selectedTokenContract.value
                        .defaultTokenToEthPrice}
                </Fee>{" "}
                ETH
              </Padded>
              <Padded>
                {"≈"}
                <Fee>0.20</Fee> USD
              </Padded>
            </AmountContainer>
          </Row>
          <RowMultiLines>
            <PKInputField
              placeholder={"Private key of the from address"}
              value={this.state.privateKey}
              onChange={e => this.handleInput("privateKey", e)}
            />
            <PrivateKeyInfo>
              Your private key is only used to sign the entered transation data.
              It is neither stored nor send somewhere.
            </PrivateKeyInfo>
          </RowMultiLines>
          <WideButton
            disabled={
              !(
                this.state.isValueValid &&
                this.state.isToValid &&
                this.state.isFromValid
              )
            }
            onClick={async () => {
              await this.signTransactionData();
              this.sendSignedTransaction();
              upsertFromAddressesLocalStorage(this.state.from);
            }}
          >
            Send
          </WideButton>
        </FormContainer>
      </Container>
    );
  }
}

TransferAndCall.contextType = Web3Context;

export default withRouter(TransferAndCall);
