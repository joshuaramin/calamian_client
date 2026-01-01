import { gql } from "@apollo/client";

export const ItemMutation = gql`
  mutation CreateMedicalItems(
    $userId: ID!
    $items: itemInput
    $categoryId: ID!
  ) {
    createMedicalItems(userID: $userId, item: $items, categoryID: $categoryId) {
      ... on item {
        itemsID
        items
        dosage
        storeInfo {
          price
        }
      }
      ... on ErrorObject {
        message
      }
    }
  }
`;

export const DeleteMedicalItem = gql`
  mutation DeleteMedicalItem($itemsId: ID!, $userId: ID!) {
    deleteMedicalItem(itemsID: $itemsId, userID: $userId) {
      itemsID
    }
  }
`;

export const UpdateMedicalItem = gql`
  mutation UpdateMedicalitems($itemsId: ID!, $userId: ID!, $items: itemInput) {
    updateMedicalitems(itemsID: $itemsId, userID: $userId, items: $items) {
      dosage
      items
      itemsID
    }
  }
`;
