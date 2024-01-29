import { gql } from "@apollo/client";


export const GetAllCategory = gql`query GetAllCategory {
    getAllCategory {
      categoryID
      category
    }
  }`


export const GetCategoryID = gql`query GetCategotiesById($categoryId: ID!) {
  getCategotiesById(categoryID: $categoryId) {
    categoryID
    category
    items {
      itemsID
      items
      dosage
      storeInfo {
        price
        quantity
        expiredDate
      }
    }
  }
}`


export const GetSearchCategory = gql`query GetSearchCategory($search: String!) {
  getSearchCategory(search: $search) {
    categoryID
    createdAt
    category
  }
}`