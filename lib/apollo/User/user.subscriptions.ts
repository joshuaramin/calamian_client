import { gql } from "@apollo/client";


export const UserSubscriptions = gql`subscription Subscription {
    createUserSubscriptions {
      email
      createdAt
      role
      userID
      password
    }
  }`