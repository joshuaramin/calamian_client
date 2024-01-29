import { gql } from '@apollo/client'


export const UpdateArchive = gql`mutation UpdateArchive($archiveId: ID!, $userId: ID!) {
  updateArchive(archiveID: $archiveId, userID: $userId) {
    archiveID
  }
}`


export const CreateArchiveCategory = gql`mutation CreateCategoryArchive($categoryId: ID!, $userId: ID!) {
  createCategoryArchive(categoryID: $categoryId, userID: $userId) {
    archiveID
  }
}`



export const CreateItemArchive = gql`mutation CreateItemArchive($itemsId: ID!, $userId: ID!) {
  createItemArchive(itemsID: $itemsId, userID: $userId) {
    archiveID
  }
}
`

export const CreateExpensesFolderArchive = gql`mutation CreateExpenseFolderArchive($expFolderId: ID!, $userId: ID!) {
  createExpenseFolderArchive(expFolderID: $expFolderId, userID: $userId) {
    archiveID
  }
}`

export const CreateUserArchive = gql`mutation CreateUserArchive($userId: ID!, $mainUser: ID!) {
  createUserArchive(userID: $userId, mainUser: $mainUser) {
    archive
    archiveID
  }
}`