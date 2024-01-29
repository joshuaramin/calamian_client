import { gql } from "@apollo/client";

export const CreateUser = gql`mutation Mutation($role: role!, $user: userInput) {
    createUserAccount(role: $role, user: $user) {
      email
      password
      role
    }
  }`


export const DeleteUser = gql`mutation DeleteUserAccount($userId: ID!, $main: ID!) {
  deleteUserAccount(userID: $userId, main: $main) {
    userID
  }
}`


export const ResetDefaultPassword = gql`mutation Mutation($userId: ID!) {
  resetUserPasswordToDefault(userID: $userId) {
    email
    userID
  }
}`


export const UpdateUserAccounts = gql`mutation UpdateUserAccounts($userId: ID!, $user: userInput) {
  updateUserAccounts(userID: $userId, user: $user) {
    userID
  }
}`


export const UpdateUserPassword = gql`mutation UpdateUserPassword($userId: ID!, $currentPasword: String!, $password: String!, $retype: String!) {
  updateUserPassword(userID: $userId, currentPasword: $currentPasword, password: $password, retype: $retype) {
    userID
  }
}`

export const UpdateUserProfile = gql`mutation UpdateUserProfile($userId: ID!, $firstname: String!, $lastname: String!, $phone: PhoneNumber!, $birthday: Date!) {
  updateUserProfile(userID: $userId, firstname: $firstname, lastname: $lastname, phone: $phone, birthday: $birthday) {
    fullname
    lastname
    firstname
    birthday
    profileID
  }
}`

export const UpdateUserEmailAddress = gql`mutation UpdateUserPassword($email: EmailAddress!, $userId: ID!) {
  updateUserEmailAddress(email: $email, userID: $userId) {
    userID
    email
  }
}`