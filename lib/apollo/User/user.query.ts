import { gql } from "@apollo/client";

export const getAllUserQuery = gql`
  query GetAllUserAccount($search: String, $role: role) {
    getAllUserAccount(search: $search, role: $role) {
      email
      userID
      role
      createdAt
      myProfile {
        fullname
        lastname
        firstname
        phone
        birthday
      }
      salary {
        salary
      }
    }
  }
`;

export const GetAllUserByManagerRole = gql`
  query GetAllUserAccountManagerRole {
    getAllUserAccountManagerRole {
      email
      userID
      role
      createdAt
      myProfile {
        fullname
        lastname
        firstname
        phone
        birthday
      }
      salary {
        salary
      }
    }
  }
`;

export const GetUserByid = gql`
  query GetUserById($userId: ID!) {
    getUserById(userID: $userId) {
      userID
      email
      role
      myProfile {
        fullname
        birthday
        phone
        profileID
      }
      logs {
        logs
        descriptions
        createdAt
      }
      salary {
        salaryID
        salary
      }
    }
  }
`;
