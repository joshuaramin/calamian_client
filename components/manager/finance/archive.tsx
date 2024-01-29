import React, { SyntheticEvent } from 'react'
import { Poppins, Oxygen } from 'next/font/google'
import styles from './archive.module.scss'
import { useMutation } from '@apollo/client'
import { GetAllExpenseFolder } from '@/lib/util/finance/finance.query'
import { CreateExpensesFolderArchive } from '@/lib/util/archive/archive.mutation'

const poppins = Poppins({
    weight: "400",
    subsets: [ "latin" ]
})

const oxygen = Oxygen({
    weight: "400",
    subsets: [ "latin" ]
})
export default function DeleteExpenseFolders({ close, expFolderId, userID }: any) {

    const [ mutate ] = useMutation(CreateExpensesFolderArchive)

    const onHandleDeleteCategory = (e: SyntheticEvent) => {
        e.preventDefault();
        mutate({
            variables: {
                expFolderId: expFolderId,
                userId: userID
            },
            onCompleted: () => {
                alert("Successfully Archived")
            },
            onError: (error) => {
                console.log(error)
            },
            refetchQueries: [ GetAllExpenseFolder ]
        })

    }
    return (
        <div className={styles.container}>
            <h2 className={poppins.className}>Archive</h2>
            <span className={oxygen.className}>Are you sure you want to archive this Expense Folder?</span>
            <form onSubmit={onHandleDeleteCategory}>
                <div className={styles.addBtnGrp}>
                    <button onClick={close} type="button" className={`${styles.cancelBtn} ${poppins.className}`}>Cancel</button>
                    <button type="submit" className={`${styles.addBtn} ${poppins.className}`}>Yes, archive this category</button>
                </div>
            </form>
        </div>
    )
}



