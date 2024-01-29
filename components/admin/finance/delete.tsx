import React, { SyntheticEvent } from 'react'
import { Poppins, Oxygen } from 'next/font/google'
import { useMutation } from '@apollo/client'
import { DeleteExpenseFolder } from '@/lib/util/finance/finance.mutation'
import { GetAllExpenseFolder } from '@/lib/util/finance/finance.query'
import styles from './delete.module.scss'


const poppins = Poppins({
    weight: "400",
    subsets: [ "latin" ]
})

const oxygen = Oxygen({
    weight: "400",
    subsets: [ "latin" ]
})
export default function DeleteExpenseFolders({ close, expFolderId, userID }: any) {

    const [ mutate ] = useMutation(DeleteExpenseFolder)

    const onHandleDeleteCategory = (e: SyntheticEvent) => {
        e.preventDefault();
        mutate({
            variables: {
                expFolderId: expFolderId,
                userId: userID
            },
            onCompleted: () => {
                alert("Successfully Deleted")
            },
            onError: (error) => {
                console.log(error)
            },
            refetchQueries: [ GetAllExpenseFolder ]
        })

    }
    return (
        <div className={styles.container}>
            <h2 className={poppins.className}>Delete</h2>
            <span className={oxygen.className}>Are you sure you want to delete this Expense Folder?</span>
            <form onSubmit={onHandleDeleteCategory}>
                <div className={styles.addBtnGrp}>
                    <button onClick={close} type="button" className={`${styles.cancelBtn} ${poppins.className}`}>Cancel</button>
                    <button type="submit" className={`${styles.addBtn} ${poppins.className}`}>Yes, Delete this Exepense Folder</button>
                </div>
            </form>
        </div>
    )
}



