import React, { SyntheticEvent, useEffect, useState } from 'react'
import styles from './delete.module.scss'
import { Poppins, Oxygen } from 'next/font/google'
import { useMutation } from '@apollo/client'
import { CreateUserArchive } from '@/lib/util/archive/archive.mutation'
import { GetAllUserByManagerRole } from '@/lib/util/User/user.query'
import Message from '@/components/message/message'


const poppins = Poppins({
    weight: "500",
    subsets: [ "latin" ]
})

const oxygen = Oxygen({
    weight: "400",
    subsets: [ "latin" ]
})
export default function DeleteUser({ userID, close, myUserid }: any) {


    const [ createUserArchiveMutation, { data } ] = useMutation(CreateUserArchive)
    const [ message, setMessage ] = useState(false)
    const onHandleDeleteItems = (e: SyntheticEvent) => {
        e.preventDefault();
        createUserArchiveMutation({
            variables: {
                userId: userID,
                mainUser: myUserid
            },
            onCompleted: () => {
                setMessage(true)
                alert("Successfully Archived")
                close()
            },
            refetchQueries: [ GetAllUserByManagerRole ]
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
            {data && message == true ? <Message msg="Successfully Archived" /> : null}
            <h2 className={poppins.className}>Archive</h2>
            <span className={oxygen.className}>Are you sure you want to archive this user?</span>
            <form onSubmit={onHandleDeleteItems}>
                <div className={styles.addBtnGrp}>
                    <button onClick={close} type="button" className={`${styles.cancelBtn} ${poppins.className}`}>Cancel</button>
                    <button type="submit" className={`${styles.addBtn} ${poppins.className}`}>Yes, Archive this user</button>
                </div>
            </form>
        </div>
    )
}
