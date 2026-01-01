import { gql } from "@apollo/client";


export const CreateExpenseFolderMutation = gql`mutation CreateExpenseFolder($exFolder: String!, $userId: ID!) {
  createExpenseFolder(exFolder: $exFolder, userID: $userId) {
    exFolder
    createdAt
  }
}`


export const DeleteExpenseFolder = gql`mutation DeleteExpFolder($expFolderId: ID!, $userId: ID!) {
  deleteExpFolder(expFolderID: $expFolderId, userID: $userId) {
    exFolder
    expFolderID
    createdAt
  }
}`

export const UpdateExpenseFolder = gql`mutation UpdateExpenseFolder($expFolderId: ID!, $userId: ID!, $exFolder: String!) {
  updateExpenseFolder(expFolderID: $expFolderId, userID: $userId, exFolder: $exFolder) {
    exFolder
    createdAt
    expFolderID
  }
}`



// expense


export const CreateExpense = gql`
  mutation CreateExpense($expFolderId: ID!, $expenses: expenseInput) {
    createExpense(expFolderID: $expFolderId, expenses: $expenses) {
      ... on expenses {
        expenseID
        expense
        createdAt
        amount
        mod
        payDate
      }
      ... on ErrorObject {
        message
      }
    }
  }
`;

export const DeleteExpense = gql`mutation DeleteExpense($expenseId: [ID]!) {
  deleteExpense(expenseID: $expenseId) {
    expenseID
    mod
    expense
    createdAt
    amount
    payDate
  }
}`

export const UpdateExpense = gql`mutation UpdateExpense($expenseId: ID!, $expenses: expenseInput) {
    updateExpense(expenseID: $expenseId, expenses: $expenses) {
      expenseID
      expense
      createdAt
      amount
      mod
      payDate
    }
  }`