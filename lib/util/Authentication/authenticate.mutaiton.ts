import { gql } from "@apollo/client";

export const Authentication = gql`mutation Mutation($email: EmailAddress!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }`