import { gql } from "@apollo/client";

export const ItemMutation = gql`
  mutation CreateMedicalItems(
    $categoryId: ID!
    $userId: ID!
    $items: itemInput
  ) {
    createMedicalItems(
      categoryID: $categoryId
      userID: $userId
      items: $items
    ) {
      itemsID
      items
      dosage
      storeInfo {
        price
        quantity
        storeInfoID
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
