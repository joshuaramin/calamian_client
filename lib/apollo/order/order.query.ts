import { gql } from "@apollo/client";

export const GetAllOrders = gql`query GetAllOrders {
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
}`


export const GetAllCurrentOrdersBy20 = gql`query GetCurrentOrdersBy20 {
  getCurrentOrdersBy20 {
    order
    itemCount
    createdAt
    total
  }
}`


export const GetAllTotalRevenue = gql`query GetAllOrders {
  getTotalRevenue
}`

export const GetTotalOrders = gql`query Query {
  getTotalNoOfOrders
}`


export const GetTotalOrderHistoryFiltered = gql`
query GetAllOrderHistory($dmy: String!) {
  getAllOrderHistory(dmy: $dmy) {
    date
    total
  }
}`