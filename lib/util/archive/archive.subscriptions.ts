import { gql } from "@apollo/client";



export const ArchiveSubscriptions = gql`subscription Subscription($tab: tab) {
    archiveSubscriptions(tab: $tab) {
      archiveID
      updatedAt
      createdAt
    }
  }`