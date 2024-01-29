import { gql } from "@apollo/client";


export const CategorySubscriptions = gql`subscription Subscription {
    categorySubscriptions {
      categoryID
      category
      createdAt
      updatedAt
    }
  }`