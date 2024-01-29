import React, { SyntheticEvent } from 'react'
import styles from './delete.module.scss'
import { Poppins, Oxygen } from 'next/font/google'
import { useMutation } from '@apollo/client'
import { CreateUserArchive } from '@/lib/util/archive/archive.mutation'
import { GetAllUserByManagerRole } from '@/lib/util/User/user.query'


const poppins = Poppins({
    weight: "500",
    subsets: [ "latin" ]
})

const oxygen = Oxygen({
    weight: "400",
    subsets: [ "latin" ]
})
export default function DeleteUser({ userID, close, myUserid }: any) {


    const [ createUserArchiveMutation ] = useMutation(CreateUserArchive)
    const onHandleDeleteItems = (e: SyntheticEvent) => {
        e.preventDefault();
        createUserArchiveMutation({
            variables: {
                userId: userID,
                mainUser: myUserid
            },
            onCompleted: () => {
                alert("Successfully Archived")
                close()
            },
            refetchQueries: [ GetAllUserByManagerRole ]
        })
    }
    return (
        <div className={styles.container}>
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
