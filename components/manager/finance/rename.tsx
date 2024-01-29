import React, { useState, SyntheticEvent } from 'react'
import { useMutation } from '@apollo/client'
import { Poppins } from 'next/font/google'
import styles from './rename.module.scss'
import { UpdateExpenseFolder } from '@/lib/util/finance/finance.mutation'
import { GetAllExpenseFolder } from '@/lib/util/finance/finance.query'

const poppins = Poppins({
    weight: "400",
    subsets: [ "latin" ]
})

export default function RenameFinanceFolder({ close, exFolder, expFolderID, userID }: any) {

    const [ exFoldeRename, setExFolderRename ] = useState("")
    const [ mutate ] = useMutation(UpdateExpenseFolder)

    const onHandleRenameCategory = (e: SyntheticEvent) => {
        e.preventDefault();
        mutate({
            variables: {
                expFolderId: expFolderID,
                exFolder: exFoldeRename,
                userId: userID
            },
            onCompleted: () => {
                alert("Successfully Updated")
            },
            errorPolicy: "all",
            refetchQueries: [ GetAllExpenseFolder ]
        })
    }
    return (
        <div className={styles.container}>
            <h2 className={poppins.className}>Rename Expense Folder</h2>
            <form onSubmit={onHandleRenameCategory}>
                <input type='text' onChange={(e) => setExFolderRename(e.target.value)} placeholder={exFolder} />
                <div className={styles.addBtnGrp}>
                    <button onClick={close} type="button">Cancel</button>
                    <button className={styles.addBtn} type="submit">Yes, Change it</button>
                </div>
            </form>
        </div>
    )
}
