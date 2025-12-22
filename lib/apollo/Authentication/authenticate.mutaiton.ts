import { gql, TypedDocumentNode } from "@apollo/client";

export const Authentication: TypedDocumentNode = gql`
  mutation Login($input: AuthInput) {
    login(input: $input) {
      ... on token {
        user {
          userID
          email
          myProfile {
            fullname
          }
          role
        }
        token
      }
      ... on ErrorObject {
        message
      }
    }
  }
`;
