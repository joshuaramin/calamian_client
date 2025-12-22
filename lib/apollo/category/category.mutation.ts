import { gql } from '@apollo/client'



export const DeleteCategory = gql`mutation DeleteCategory($categoryId: ID!, $userId: ID!) {
  deleteCategory(categoryID: $categoryId, userID: $userId) {
    categoryID
    category
  }
}`

export const UpdateCategory = gql`mutation UpdateCategory($categoryId: ID!, $category: String!, $userId: ID!) {
  updateCategory(categoryID: $categoryId, category: $category, userID: $userId) {
    categoryID
    category
  }
}`

export const AddCategory = gql`mutation CreateCategory($category: String!, $userId: ID!) {
  createCategory(category: $category, userID: $userId) {
    categoryID
    category
  }
}`