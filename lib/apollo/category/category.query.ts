import { gql } from "@apollo/client";

export const GetAllCategory = gql`
  query ExampleQuery($search: String) {
    getAllCategory(search: $search) {
      categoryID
      category
      createdAt
    }
  }
`;

export const GetCategoryID = gql`
  query GetCategotiesById($categoryId: ID!) {
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
  }
`;
