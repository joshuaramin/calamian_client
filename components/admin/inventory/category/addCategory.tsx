import React, { useState, SyntheticEvent } from 'react'
import { Poppins } from 'next/font/google'
import { AddCategory } from '@/lib/util/category/category.mutation'
import { useMutation } from '@apollo/client'
import styles from './addcCategory.module.scss'

const poppins = Poppins({
    weight: "400",
    subsets: [ "latin" ]
})
export default function AddCategories({ close, userID }: any) {

    const [ category, setCategory ] = useState("")
    const [ mutate ] = useMutation(AddCategory)

    const onHandleAddCatgory = (e: SyntheticEvent) => {
        e.preventDefault()
        mutate({
            variables: {
                category,
                userId: userID
            },
            onCompleted: () => {
                alert("Successfully Added")
                setCategory("")
            },
            errorPolicy: "all"
        })
    }
    return (
        <div className={styles.container}>
            <h2 className={poppins.className}>Add Category</h2>
            <form onSubmit={onHandleAddCatgory}>
                <input className={styles.inp} type="text" value={category} placeholder='Category Name' onChange={(e) => setCategory(e.target.value)} />
                <div className={styles.addBtnGrp}>
                    <button onClick={close} type="button">Cancel</button>
                    <button className={styles.addBtn} type="submit">Submit</button>
                </div>
            </form>
        </div>
    )
}
