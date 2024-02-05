import React, { SyntheticEvent, useEffect, useState } from 'react'
import styles from './delete.module.scss'
import { Poppins, Oxygen } from 'next/font/google'
import { useMutation } from '@apollo/client'
import { DeleteUser as DeleteUserAccount } from '@/lib/util/User/user.mutation'
import { getAllUserQuery } from '@/lib/util/User/user.query'
import Message from '@/components/message/message'


const poppins = Poppins({
    weight: "500",
    subsets: [ "latin" ]
})

const oxygen = Oxygen({
    weight: "400",
    subsets: [ "latin" ]
})
export default function DeleteUser({ userID, close, mUser }: any) {


    const [ deleteUserMutation, { data } ] = useMutation(DeleteUserAccount)
    const [ message, setMessage ] = useState<Boolean>(false)
    const onHandleDeleteItems = (e: SyntheticEvent) => {
        e.preventDefault();
        deleteUserMutation({
            variables: {
                userId: userID,
                main: mUser
            },
            onCompleted: () => {
                setMessage(true)
            },
            refetchQueries: [ getAllUserQuery ]
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
            <span className={oxygen.className}>Are you sure you want to delete this user?</span>
            <form onSubmit={onHandleDeleteItems}>
                <div className={styles.addBtnGrp}>
                    <button onClick={close} type="button" className={`${styles.cancelBtn} ${poppins.className}`}>Cancel</button>
                    <button type="submit" className={`${styles.addBtn} ${poppins.className}`}>Yes, Delete this user</button>
                </div>
            </form>
        </div>
    )
}
