import React, { useState, SyntheticEvent, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { Poppins } from 'next/font/google'
import styles from './rename.module.scss'
import { UpdateExpenseFolder } from '@/lib/util/finance/finance.mutation'
import { GetAllExpenseFolder } from '@/lib/util/finance/finance.query'
import Message from '@/components/message/message'

const poppins = Poppins({
    weight: "400",
    subsets: [ "latin" ]
})

export default function RenameFinanceFolder({ close, exFolder, expFolderID, userID }: any) {

    const [ exFoldeRename, setExFolderRename ] = useState("")
    const [ mutate, { data } ] = useMutation(UpdateExpenseFolder)
    const [ message, setMessage ] = useState<boolean>(false)
    const onHandleRenameCategory = (e: SyntheticEvent) => {
        e.preventDefault();
        mutate({
            variables: {
                expFolderId: expFolderID,
                exFolder: exFoldeRename,
                userId: userID
            },
            onCompleted: () => {
                setMessage(true)
            },
            errorPolicy: "all",
            refetchQueries: [ GetAllExpenseFolder ]
        })
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setMessage(false)
        }, 2000);


        return () => clearInterval(interval)
    }, [ message ])


    return (
        <div className={styles.container}>
            {data && message == true ? <Message msg="Successfully Reset Password" /> : null}
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
