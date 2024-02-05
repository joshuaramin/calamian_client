import React, { useState, SyntheticEvent, useEffect } from 'react'
import { Poppins } from 'next/font/google'
import { CreateExpenseFolderMutation } from '@/lib/util/finance/finance.mutation'
import { useMutation } from '@apollo/client'
import styles from './add.module.scss'
import Message from '@/components/message/message'

const poppins = Poppins({
    weight: "400",
    subsets: [ "latin" ]
})
export default function AddExpenseFolder({ close, userID }: any) {

    const [ exFolder, setexFolder ] = useState("")
    const [ mutate, { data } ] = useMutation(CreateExpenseFolderMutation)
    const [ message, setMessage ] = useState<boolean>(false)

    const onHandleAddCatgory = (e: SyntheticEvent) => {
        e.preventDefault()
        mutate({
            variables: {
                exFolder: exFolder,
                userId: userID
            },
            onCompleted: () => {
                setMessage(true)
                setexFolder("")
            },
            errorPolicy: "all"
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
            {data && message == true ? <Message msg="Successfully Added" /> : null}
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
