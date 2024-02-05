import React, { useState, SyntheticEvent, useEffect } from 'react'
import { Poppins } from 'next/font/google'
import { AddCategory } from '@/lib/util/category/category.mutation'
import { useMutation } from '@apollo/client'
import styles from './addcCategory.module.scss'
import Message from '@/components/message/message'


const poppins = Poppins({
    weight: "400",
    subsets: [ "latin" ]
})
export default function AddCategories({ close, userID }: any) {

    const [ category, setCategory ] = useState("")
    const [ mutate, { data } ] = useMutation(AddCategory)
    const [ message, setMessage ] = useState<boolean>(false)

    const onHandleAddCatgory = (e: SyntheticEvent) => {
        e.preventDefault()
        mutate({
            variables: {
                category,
                userId: userID
            },
            onCompleted: () => {
                setMessage(true)
                setCategory("")
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
            {data && message === true ? <Message msg="Successfully Added" /> : null}
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
