import React, { useState, SyntheticEvent } from 'react'
import { useMutation } from '@apollo/client'
import { Poppins } from 'next/font/google'
import { UpdateCategory } from '@/lib/util/category/category.mutation'
import { GetAllCategory } from '@/lib/util/category/category.query'
import styles from './rename.module.scss'

const poppins = Poppins({
    weight: "400",
    subsets: [ "latin" ]
})

export default function Rename({ close, categoryID, category, userID }: any) {

    const [ categ, setCategory ] = useState("")
    const [ mutate ] = useMutation(UpdateCategory)

    const onHandleRenameCategory = (e: SyntheticEvent) => {
        e.preventDefault();
        mutate({
            variables: {
                categoryId: categoryID,
                category: categ,
                userId: userID
            },
            onCompleted: () => {
                alert("Successfully Updated")
            },
            errorPolicy: "all",
            refetchQueries: [ GetAllCategory ]
        })
    }
    return (
        <div className={styles.container}>
            <h2 className={poppins.className}>Rename</h2>
            <form onSubmit={onHandleRenameCategory}>
                <input type='text' onChange={(e) => setCategory(e.target.value)} placeholder={category} />
                <div className={styles.addBtnGrp}>
                    <button onClick={close} type="button">Cancel</button>
                    <button className={styles.addBtn} type="submit">Yes, Change it</button>
                </div>
            </form>
        </div>
    )
}
