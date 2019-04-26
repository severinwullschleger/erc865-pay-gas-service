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

  if (insert.result.ok === 1) {
    return {_id: insert.insertedId};
  } else {
    throw {statusCode: 500};
  }
};

export const updateTransaction = async (transactionHash, status, receipt) => {
  db.collection('transactions').update(
    { _id: transactionHash },
    {
      $set: {
        status,
        receipt,
        modified: new Date()
      }
    },
    { upsert: true }
  )
};