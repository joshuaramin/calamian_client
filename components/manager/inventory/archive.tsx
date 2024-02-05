import React, { SyntheticEvent } from 'react'
import styles from './archive.module.scss'
import { useMutation } from '@apollo/client'
import { Poppins, Oxygen } from 'next/font/google'
import { CreateItemArchive } from '@/lib/util/archive/archive.mutation'
import { getItemByCategoryid } from '@/lib/util/Items/item.query'

const poppins = Poppins({
    weight: "500",
    subsets: [ "latin" ]
})

const oxygen = Oxygen({
    weight: "400",
    subsets: [ "latin" ]
})
export default function Delete({ close, id, categoryID, userID }: any) {


    const [ ArchiveMutation ] = useMutation(CreateItemArchive)

    const onHandleDeleteItems = (e: SyntheticEvent) => {
        e.preventDefault()
        ArchiveMutation({
            variables: {
                itemsId: id,
                userId: userID
            },
            onCompleted: () => {
                alert("Successfully Archived")
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
            <h2 className={poppins.className}>Archive</h2>
            <span className={oxygen.className}>Are you sure you want to archive this item?</span>
            <form onSubmit={onHandleDeleteItems}>
                <div className={styles.addBtnGrp}>
                    <button onClick={close} type="button" className={`${styles.cancelBtn} ${poppins.className}`}>Cancel</button>
                    <button type="submit" className={`${styles.addBtn} ${poppins.className}`}>Yes, Archive this item</button>
                </div>
            </form>
        </div>
    )
}
