import React, { useState, SyntheticEvent, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { Poppins } from 'next/font/google'
import styles from './rename.module.scss'
import { UpdateCategory } from '@/lib/util/category/category.mutation'
import { GetAllCategory } from '@/lib/util/category/category.query'
import Message from '@/components/message/message'

const poppins = Poppins({
    weight: "400",
    subsets: [ "latin" ]
})

export default function Rename({ close, categoryID, category, userID }: any) {

    const [ categ, setCategory ] = useState("")
    const [ mutate, { data } ] = useMutation(UpdateCategory)

    const [ message, setMessage ] = useState<boolean>(false)

    const onHandleRenameCategory = (e: SyntheticEvent) => {
        e.preventDefault();
        mutate({
            variables: {
                categoryId: categoryID,
                category: categ,
                userId: userID
            },
            onCompleted: () => {
                setMessage(true)
            },
            errorPolicy: "all",
            refetchQueries: [ GetAllCategory ]
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
            {data && message === true ? <Message msg="Successfully Updated" /> : null}
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
