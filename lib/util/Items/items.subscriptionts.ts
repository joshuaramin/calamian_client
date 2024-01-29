import { gql } from "@apollo/client";

export const createItemSubscriptons = gql`subscription Subscription($categoryId: ID!) {
    createItemSubscriptions(categoryID: $categoryId) {
      items
      itemsID
      dosage
    }
  }`