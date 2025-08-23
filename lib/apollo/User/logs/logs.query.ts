import { gql } from "@apollo/client";


export const UsersActivityLogs = gql`query GetLogByUserId(
    $userId: ID!
    $orders: String!
    $take: Int!
    $offset: Int!
  ) {
    getLogByUserId(
      userID: $userId
      orders: $orders
      take: $take
      offset: $offset
    ) {
      logsID
      logs
      descriptions
      createdAt
    }
  }
  `