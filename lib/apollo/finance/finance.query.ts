import { gql } from "@apollo/client";

export const GetAllExpenseFolder = gql`
  query GetAllExpenseFolder($search: String) {
    getAllExpenseFolder(search: $search) {
      expFolderID
      exFolder
      createdAt
    }
  }
`;
export const GetAllExpense = gql`
  query Query($expFolderId: ID!) {
    getAllExpense(expFolderID: $expFolderId) {
      expense
      expenseID
      amount
      mod
      payDate
      createdAt
    }
  }
`;

export const GetExpenseFolderById = gql`
  query GetExpenseFolderById($expFolderId: ID!) {
    getExpenseFolderById(expFolderID: $expFolderId) {
      expFolderID
      exFolder
      createdAt
    }
  }
`;

export const GetExpenseByGroup = gql`
  query GetAllExpenseByGroup($expFolderId: ID!) {
    getAllExpenseByGroup(expFolderID: $expFolderId) {
      expense
      expenseID
      mod
      payDate
      amount
      createdAt
    }
  }
`;
