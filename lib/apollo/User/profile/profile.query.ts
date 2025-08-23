import { gql } from "@apollo/client";


export const ProfileByUserId = gql`query Query($userId: ID!) {
    getProfileByUserId(userID: $userId) {
      profileID
      fullname
      firstname
      lastname
      birthday
      phone
    }
  }`