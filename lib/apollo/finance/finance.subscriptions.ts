import { gql } from "@apollo/client";



export const ExpenseSubscriptions = gql`subscription Subscription($expFolderId: ID!) {
    expensesSubscriptions(expFolderID: $expFolderId) {
      expense
      expenseID
      amount
      mod
      payDate
      createdAt
    }
  }`

export const ExpenseFolderSubscriptions = gql`subscription ExpenseFolderSubscriptions {
    expenseFolderSubscriptions {
      expFolderID
      exFolder
      createdAt
    }
  }`