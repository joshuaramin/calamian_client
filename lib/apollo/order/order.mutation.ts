import { gql } from "@apollo/client";

export const CreateOrder = gql`
  mutation Mutation($orders: [OrderInput!]!) {
    createAnOrder(orders: $orders) {
      order
      orderID
    }
  }
`;

export const ReportOrders = gql`
  mutation GenerateOrderReport($startDate: String!, $endDate: String!) {
    generateOrderReport(startDate: $startDate, endDate: $endDate) {
      order
      orderID
      createdAt
      total
      itemCount
    }
  }
`;
