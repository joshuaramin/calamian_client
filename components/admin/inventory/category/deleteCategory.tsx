import React, { SyntheticEvent } from 'react'
import { Poppins, Oxygen } from 'next/font/google'
import { useMutation } from '@apollo/client'
import { DeleteCategory as DeleteCategoryID } from '@/lib/util/category/category.mutation'
import { GetAllCategory } from '@/lib/util/category/category.query'
import styles from './delete.module.scss'

const poppins = Poppins({
    weight: "400",
    subsets: [ "latin" ]
})

const oxygen = Oxygen({
    weight: "400",
    subsets: [ "latin" ]
})
export default function DeleteCategory({ close, categoryID, userID }: any) {

    const [ mutate ] = useMutation(DeleteCategoryID)

    const onHandleDeleteCategory = (e: SyntheticEvent) => {
        e.preventDefault();
        mutate({
            variables: {
                categoryId: categoryID,
                userId: userID
            },
            onCompleted: () => {
                alert("Successfully Deleted")
            },
            onError: (error) => {
                console.log(error)
            },
            refetchQueries: [ GetAllCategory ]
        })

    }
    return (
        <div className={styles.container}>
            <h2 className={poppins.className}>Delete</h2>
            <span className={oxygen.className}>Are you sure you want to delete this category?</span>
            <form onSubmit={onHandleDeleteCategory}>
                <div className={styles.addBtnGrp}>
                    <button onClick={close} type="button" className={`${styles.cancelBtn} ${poppins.className}`}>Cancel</button>
                    <button type="submit" className={`${styles.addBtn} ${poppins.className}`}>Yes, Delete this category</button>
                </div>
            </form>
        </div>
    )
}



