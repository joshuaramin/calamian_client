import { gql, TypedDocumentNode } from "@apollo/client";

export const GetAllOrders = gql`
  query GetAllOrders {
    getAllOrders {
      orderID
      order
      total
      createdAt
      itemCount
      orderCart {
        orderListItemID
        cartItem {
          items
        }
        quantity
        total
      }
    }
  }
`;

export const GetAllCurrentOrdersBy20 = gql`
  query GetCurrentOrdersBy20 {
    getCurrentOrdersBy20 {
      order
      itemCount
      createdAt
      total
    }
  }
`;

export const GetTotal: TypedDocumentNode = gql`
  query GetTotal {
    getTotal {
      totalItems
      totalOrders
      totalRevenue
    }
  }
`;

export const GetTotalOrderHistoryFiltered: TypedDocumentNode = gql`
  query GetAllOrderHistory($dmy: String!) {
    getAllOrderHistory(dmy: $dmy) {
      date
      total
    }
  }
`;
