import React, { SyntheticEvent } from 'react'
import styles from './delete.module.scss'
import { useMutation } from '@apollo/client'
import { Poppins, Oxygen } from 'next/font/google'
import { DeleteMedicalItem } from '@/lib/util/Items/item.mutation'
import { getItemByCategoryid } from '@/lib/util/Items/item.query'

const poppins = Poppins({
    weight: "500",
    subsets: [ "latin" ]
})

const oxygen = Oxygen({
    weight: "400",
    subsets: [ "latin" ]
})
export default function Delete({ id, close, categoryID, userId }: any) {


    const [ DeleteMutation ] = useMutation(DeleteMedicalItem)

    const onHandleDeleteItems = (e: SyntheticEvent) => {
        e.preventDefault()
        DeleteMutation({
            variables: {
                itemsId: id,
                userId: userId
            },
            onCompleted: () => {
                alert("Successfully Deleted")
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

    return (
        <div className={styles.container}>
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
