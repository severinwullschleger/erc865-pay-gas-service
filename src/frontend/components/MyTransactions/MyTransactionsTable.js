import React from "react";
import styled from "styled-components";
import { Table } from "../../views/design-components/Table/Table.js";
import config from "../../../config.json"

const Container = styled.div`
  font-size: 14px;
  width: 1000px;
  padding: 5px 25px;
`;

const NoTxs = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

const getData = props => {
  let data = [];
  props.txs.map(tx => {
    return data.push({
      txHash: tx._id.substring(0, 8) + "..." + tx._id.substring(tx._id.length - 4),
      status: tx.status,
      age: getAge(tx.created),
      from: tx.transactionInput.from.substring(0, 17) + "..." + tx.transactionInput.from.substring(tx.transactionInput.from.length - 4),
      to: tx.transactionInput.to.substring(0, 17) + "..."  + tx.transactionInput.to.substring(tx.transactionInput.to.length - 4),
      quantity: tx.transactionInput.value + " " + config.acceptedTokens[tx.transactionInput.tokenContractIndex].symbol,
      calledMethod: tx.type
    });
  });
  return data;
};

const getAge = date => {
  let age = new Date() - new Date(date).getTime();

  age = age / 1000;
  if (age < 60) return Math.floor(age) + " sec" + (Math.floor(age) === 1 ? "" : "s");
  age = age / 60;
  if (age < 60) return Math.floor(age) + " minute" + (Math.floor(age) === 1 ? "" : "s");
  age = age / 60;
  if (age < 24) return Math.floor(age) + " hour" + (Math.floor(age) === 1 ? "" : "s");
  age = age / 24;
  return Math.floor(age) + " day" + (Math.floor(age) === 1 ? "" : "s");
};

const MyTransactionsTable = props => {
  return (
    <Container>
      {!props.txs || props.txs.length === 0 ? (
        <NoTxs>
          <i>You don't have any transactions registered yet.</i>
        </NoTxs>
      ) : (
        <Table
          header={[
            "Txn Hash",
            "Status",
            "Age",
            "From",
            "To",
            "Quantity",
            "Method"
          ]}
          data={getData(props)}
          columnWidth={["16", "12", "8", "21", "21", "10", "12"]}
        />
      )}
    </Container>
  );
};

export default MyTransactionsTable;
