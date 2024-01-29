import React, { SyntheticEvent } from 'react'
import { Poppins, Oxygen } from 'next/font/google'
import styles from './archive.module.scss'
import { useMutation } from '@apollo/client'
import { CreateArchiveCategory } from '@/lib/util/archive/archive.mutation'
import { GetAllCategory } from '@/lib/util/category/category.query'


const poppins = Poppins({
    weight: "400",
    subsets: [ "latin" ]
})

const oxygen = Oxygen({
    weight: "400",
    subsets: [ "latin" ]
})
export default function DeleteCategory({ close, categoryID, userID }: any) {

    const [ mutate ] = useMutation(CreateArchiveCategory)

    const onHandleDeleteCategory = (e: SyntheticEvent) => {
        e.preventDefault();
        mutate({
            variables: {
                categoryId: categoryID,
                userId: userID
            },
            onCompleted: () => {
                alert("Successfully Archived")
            },
            onError: (error) => {
                console.log(error)
            },
            refetchQueries: [ GetAllCategory ]
        })

    }
    return (
        <div className={styles.container}>
            <h2 className={poppins.className}>Archive</h2>
            <span className={oxygen.className}>Are you sure you want to archive this category?</span>
            <form onSubmit={onHandleDeleteCategory}>
                <div className={styles.addBtnGrp}>
                    <button onClick={close} type="button" className={`${styles.cancelBtn} ${poppins.className}`}>Cancel</button>
                    <button type="submit" className={`${styles.addBtn} ${poppins.className}`}>Yes, Delete this category</button>
                </div>
            </form>
        </div>
    )
}



