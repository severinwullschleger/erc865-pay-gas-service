import {db} from '../index.mjs';
import {TRANSACTION_STATUS} from "./transaction-states.mjs";

export const getTransaction = transactionHash => {
  return db.collection('transactions').findOne({"_id": transactionHash});
};

export const getTransactions = from => {
  return db.collection('transactions').find({from});
};

export const saveTransaction = async (transactionHash, transactionInput, serviceAccountAddress) => {

  let insert = await db.collection('transactions').insertOne({
    _id: transactionHash,
    transactionInput,
    from: transactionInput.from,
    status: TRANSACTION_STATUS.PENDING,
    created: new Date(),
    modified: new Date(),
    serviceAccountAddress
  });

  return insert.result.ok === 1;
};

export const updateTransaction = async (transactionHash, status, receipt, error) => {
  return db.collection('transactions').updateOne(
    { _id: transactionHash },
    {
      $set: {
        status,
        receipt,
        modified: new Date(),
        error
      }
    },
    { upsert: true }
  )
};