import React, { useState, SyntheticEvent } from 'react'
import { Poppins } from 'next/font/google'
import { CreateExpenseFolderMutation } from '@/lib/util/finance/finance.mutation'
import { useMutation } from '@apollo/client'
import styles from './add.module.scss'

const poppins = Poppins({
    weight: "400",
    subsets: [ "latin" ]
})
export default function AddExpenseFolder({ close, userID }: any) {

    const [ exFolder, setexFolder ] = useState("")
    const [ mutate ] = useMutation(CreateExpenseFolderMutation)

    const onHandleAddCatgory = (e: SyntheticEvent) => {
        e.preventDefault()
        mutate({
            variables: {
                exFolder: exFolder,
                userId: userID
            },
            onCompleted: () => {
                alert("Successfully Added")
                setexFolder("")
            },
            errorPolicy: "all"
        })
    }
    return (
        <div className={styles.container}>
            <h2 className={poppins.className}>Add Expense Folder</h2>
            <form onSubmit={onHandleAddCatgory}>
                <input className={styles.inp} type="text" value={exFolder} placeholder='Expense Folder Name' onChange={(e) => setexFolder(e.target.value)} />
                <div className={styles.addBtnGrp}>
                    <button onClick={close} type="button">Cancel</button>
                    <button className={styles.addBtn} type="submit">Submit</button>
                </div>
            </form>
        </div>
    )
}
