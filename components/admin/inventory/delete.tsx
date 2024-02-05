import React, { SyntheticEvent, useEffect, useState } from 'react'
import styles from './delete.module.scss'
import { useMutation } from '@apollo/client'
import { Poppins, Oxygen } from 'next/font/google'
import { DeleteMedicalItem } from '@/lib/util/Items/item.mutation'
import { getItemByCategoryid } from '@/lib/util/Items/item.query'
import Message from '@/components/message/message'

const poppins = Poppins({
    weight: "500",
    subsets: [ "latin" ]
})

const oxygen = Oxygen({
    weight: "400",
    subsets: [ "latin" ]
})
export default function Delete({ id, close, categoryID, userId }: any) {


    const [ DeleteMutation, { data } ] = useMutation(DeleteMedicalItem)

    const [ message, setMessage ] = useState(false)

    const onHandleDeleteItems = (e: SyntheticEvent) => {
        e.preventDefault()
        DeleteMutation({
            variables: {
                itemsId: id,
                userId: userId
            },
            onCompleted: () => {
                setMessage(true)
                close()
            },
            refetchQueries: [ {
                query: getItemByCategoryid,
                variables: {
                    categoryId: categoryID
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
            {data && message == true ? <Message msg="Successfully Deleted" /> : null}
            <h2 className={poppins.className}>Delete</h2>
            <span className={oxygen.className}>Are you sure you want to delete this item?</span>
            <form onSubmit={onHandleDeleteItems}>
                <div className={styles.addBtnGrp}>
                    <button onClick={close} type="button" className={`${styles.cancelBtn} ${poppins.className}`}>Cancel</button>
                    <button type="submit" className={`${styles.addBtn} ${poppins.className}`}>Yes, Delete this item</button>
                </div>
            </form>
        </div>
    )
}
