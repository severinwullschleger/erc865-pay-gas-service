import React from "react";
import styled from "styled-components";
import { getTransactions } from "./MyTransactionsMethods.js";
import { Card } from "../../views/Card.js";
import Modal from "../../views/design-components/Modal.js";
import MyTransactionsTable from "./MyTransactionsTable.js";
import GridSpinner from "../../views/spinners/GridSpinner.js";

const Container = styled.div`
  display: flex;
  justify-content: center;
`;

class MyTransactions extends React.Component {
  constructor() {
    super();
    this.state = {
      txs: null,
      txsLoading: false,
      errorMessage: null
    };
  }

  componentDidMount() {
    this.setState({ txsLoading: true });
    getTransactions()
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          this.setState({ txs: response.data.reverse() });
        } else {
          this.setState({
            errorMessage: response.error,
            txsLoading: false
          });
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({
          errorMessage: "Ouh. Something went wrong.",
          txsLoading: false
        });
      });
  }

  renderModals() {
    return (
      <div>
        <Modal
          type={"notification"}
          toggle={() => {
            this.setState({ errorMessage: null });
          }}
          show={this.state.errorMessage}
          title={"You got the following error"}
        >
          {this.state.errorMessage}
        </Modal>
      </div>
    );
  }

  render() {
    return (
      <Container>
        {this.renderModals()}
        {this.state.txs ? (
          <MyTransactionsTable txs={this.state.txs} />
        ) : (
          <GridSpinner />
        )}
      </Container>
    );
  }
}

export default MyTransactions;
