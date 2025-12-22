import { gql } from '@apollo/client'


export const ProfileUpdate = gql`mutation UpdateUserProfile($userId: ID!, $firstname: String!, $lastname: String!, $phone: PhoneNumber!, $birthday: Date!) {
    updateUserProfile(userID: $userId, firstname: $firstname, lastname: $lastname, phone: $phone, birthday: $birthday) {
      profileID
      firstname
      fullname
      lastname
      birthday
      phone
    }
  }`