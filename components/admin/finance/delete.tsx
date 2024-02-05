import React, { SyntheticEvent, useEffect, useState } from 'react'
import { Poppins, Oxygen } from 'next/font/google'
import { useMutation } from '@apollo/client'
import { DeleteExpenseFolder } from '@/lib/util/finance/finance.mutation'
import { GetAllExpenseFolder } from '@/lib/util/finance/finance.query'
import styles from './delete.module.scss'
import Message from '@/components/message/message'


const poppins = Poppins({
    weight: "400",
    subsets: [ "latin" ]
})

const oxygen = Oxygen({
    weight: "400",
    subsets: [ "latin" ]
})
export default function DeleteExpenseFolders({ close, expFolderId, userID }: any) {

    const [ mutate, { data } ] = useMutation(DeleteExpenseFolder)
    const [ message, setMessage ] = useState<boolean>(false)


    const onHandleDeleteCategory = (e: SyntheticEvent) => {
        e.preventDefault();
        mutate({
            variables: {
                expFolderId: expFolderId,
                userId: userID
            },
            onCompleted: () => {
                setMessage(true)
            },
            onError: (error) => {
                console.log(error)
            },
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
            {data && message == true ? <Message msg="Successfully Deleted" /> : null}


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



