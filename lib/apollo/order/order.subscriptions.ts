import { gql } from "@apollo/client";


export const OrderSubscriptions = gql`subscription Subscription {
  createOrders {
    createdAt
    itemCount
    order
    orderID
    total
  }
}`