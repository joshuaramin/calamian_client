import { gql } from "@apollo/client";


export const getNotificationUpdate = gql`mutation UpdateNotificationSystem($notificationId: ID!) {
    updateNotificationSystem(notificationID: $notificationId) {
      createdAt
      notifStatus
      notification
      notificationID
    }
  }`