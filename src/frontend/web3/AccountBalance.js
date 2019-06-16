import React from 'react';
import styled from 'styled-components';
import {__GRAY_100, __GRAY_200, __THIRD} from '../helpers/colors.js';
import Icon from '../webpack/views/icons/Icon.js';
import Web3Providers from './Web3Providers.mjs';
import Select from 'react-select';
import {Balance} from '../webpack/views/Balance.js';
import withWeb3 from '../webpack/contexts/WithWeb3.js';
import connect from 'react-redux/es/connect/connect.js';
import {updateAccounts} from '../webpack/reducers/account.js';

const Parent = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
`;
const Container = styled.div`
  display: flex;
  margin: 10px 0;
  justify-content: center;
`;

const ColumnLeft = styled.div`
  display: flex;
  flex-direction: column;
  background: ${__GRAY_100};
  padding: 20px;
  border-bottom-left-radius: 6px;
  border-top-left-radius: 6px;
`;

const ColumnRight = styled.div`
  display: flex;
  flex-direction: column;
  background: ${__GRAY_200};
  padding: 20px;
  border-bottom-right-radius: 6px;
  border-top-right-radius: 6px;
`;

const Address = styled.div``;

const Title = styled.h4`
  margin: 0;
`;

class AccountBalance extends React.Component {
  handleChange = selectedAccount => {
    localStorage.setItem(
      'ganache',
      JSON.stringify(selectedAccount.label.toString())
    );
    this.props.updateAccounts(
      this.props.context.web3,
      this.props.context.provider,
      this.props.context.tokenContract
    );
  };

  renderGanacheAccounts() {
    const address = this.props.selectedAccount
      ? this.props.selectedAccount.address
      : null;
    const balance = this.props.selectedAccount
      ? this.props.selectedAccount.balance
      : null;
    return (
      <div>
        <Select
          simpleValue
          style={{color: 'inherit'}}
          value={
            this.props.selectedAccount.balance
              ? this.props.selectedAccount.balance
              : null
          }
          onChange={this.handleChange}
          options={Array.from(this.props.accounts.keys()).map(addr => ({
            label: addr,
            value: this.props.accounts.get(addr)
          }))}
        />

        {address && balance ? (
          <Container>
            <ColumnLeft>
              <Title>Selected Account</Title>
              <Address>{address}</Address>
            </ColumnLeft>

            <ColumnRight>
              <Title>Balance</Title>
              <Balance balance={balance}>
                <Icon
                  icon={'ethereum'}
                  width={15}
                  height={15}
                  color={__THIRD}
                  bottom={'3'}
                />
              </Balance>
            </ColumnRight>
          </Container>
        ) : null}
      </div>
    );
  }

  renderMetaMaskAccount() {
    return (
      <div>
        {Array.from(this.props.accounts.keys()).map((address, index) => {
          return (
            <Container key={index}>
              <ColumnLeft>
                <Title>Selected Account</Title>
                <Address>{address}</Address>
              </ColumnLeft>

              <ColumnRight>
                <Title>Balance</Title>
                <Balance balance={this.props.accounts.get(address)}>
                  <Icon
                    icon={'ethereum'}
                    width={15}
                    height={15}
                    color={__THIRD}
                    bottom={'3'}
                  />
                </Balance>
              </ColumnRight>
            </Container>
          );
        })}
      </div>
    );
  }
  render() {
    return (
      //  Either Metamask (no in-app addresses switch possible) or Ganache (react select for address selection)
      <Parent>
        {this.props.accounts &&
        this.props.context.provider === Web3Providers.META_MASK
          ? this.renderMetaMaskAccount()
          : this.renderGanacheAccounts()}
      </Parent>
    );
  }
}

export default withWeb3(
  connect(
    state => ({
      selectedAccount: state.accountsData.selectedAccount,
      accounts: state.accountsData.accounts
    }),
    dispatch => {
      return {
        updateAccounts: (web3, provider, tokenContract) => {
          dispatch(updateAccounts(web3, provider, tokenContract));
        }
      };
    }
  )(AccountBalance)
);
