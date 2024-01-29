import { gql } from "@apollo/client";


export const GetAllArchive = gql`query GetAllArchiveByTab($tab: tab) {
  getAllArchiveByTab(tab: $tab) {
    archiveID
    user {
      salary {
        salary
      }
      role
      myProfile {
        fullname
        phone
      }
      email
      userID
    }
    items {
      items
      dosage
      itemsID
      storeInfo {
        price
        expiredDate
      }
      category {
        category
        categoryID
      }
    }
    categories {
      categoryID
      category
      totalNumberOfItems
    }
    expenseFolder {
      expFolderID
      exFolder
      createdAt
      expenseAmount
    }
    createdAt
  }
}`