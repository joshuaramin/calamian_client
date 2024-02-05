import React, { SyntheticEvent, useEffect, useState } from 'react'
import { Poppins, Oxygen } from 'next/font/google'
import { useMutation } from '@apollo/client'
import { DeleteExpense } from '@/lib/util/finance/finance.mutation'
import { GetAllExpense } from '@/lib/util/finance/finance.query'
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
export default function DeleteExepenses({ close, items, data, folderId, deleted }: any) {

    const [ mutate, { data: ExpenseData } ] = useMutation(DeleteExpense)
    const [ message, setMessage ] = useState<boolean>(false)

    const onHandleDeleteCategory = (e: SyntheticEvent) => {
        e.preventDefault();
        mutate({
            variables: {
                expenseId: data
            },
            onError: (error) => {
                console.log(error)
            },
            onCompleted: () => {
                setMessage(true)
                deleted()
                close()
            },
            refetchQueries: [ {
                query: GetAllExpense,
                variables: {
                    expFolderId: folderId
                }
            } ]
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
            {ExpenseData && message == true ? <Message msg="Successfully Added" /> : null}
            <h2 className={poppins.className}>Delete</h2>
            <span className={oxygen.className}>Are you sure you want to delete this {items} item/s?</span>
            <form onSubmit={onHandleDeleteCategory}>
                <div className={styles.addBtnGrp}>
                    <button onClick={close} type="button" className={`${styles.cancelBtn} ${poppins.className}`}>Cancel</button>
                    <button type="submit" className={`${styles.addBtn} ${poppins.className}`}>Yes, Delete this category</button>
                </div>
            </form>
        </div>
    )
}



