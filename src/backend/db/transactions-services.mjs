import { db } from "../index.mjs";
import { TRANSACTION_STATUS } from "./transaction-states.mjs";

export const getTransaction = transactionHash => {
  return db.collection("transactions").findOne({ _id: transactionHash });
};

export const getTransactions = fromAddresses => {
  if (fromAddresses) {
    return db
      .collection("transactions")
      .find({ from: { $in: fromAddresses } })
      .sort({ created: 1 })
      .toArray();
  } else
    return db
      .collection("transactions")
      .find()
      .sort({ created: 1 })
      .toArray();
};

export const saveTransaction = async (
  transactionHash,
  transactionInput,
  serviceAccountAddress,
  type
) => {
  let insert = await db.collection("transactions").insertOne({
    _id: transactionHash,
    transactionInput,
    from: transactionInput.from,
    status: TRANSACTION_STATUS.PENDING,
    created: new Date(),
    modified: new Date(),
    serviceAccountAddress,
    type
  });

  return insert.result.ok === 1;
};

export const updateTransaction = async (
  transactionHash,
  status,
  receipt,
  error
) => {
  return db.collection("transactions").updateOne(
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
  );
};
