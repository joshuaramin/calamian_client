import { gql } from "@apollo/client";



export const GetAllNotification = gql`query GetAllNotification {
    getAllNotification {
      notifStatus
      notificationID
      notification
      createdAt
    }
  }`

export const GetAllUnreadNotification = gql`query GetAllUnreadNotification {
    getAllUnreadNotification {
      notificationID
      notification
      createdAt
      notifStatus
    }
  }`