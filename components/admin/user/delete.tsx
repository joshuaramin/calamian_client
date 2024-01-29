import React, { SyntheticEvent } from 'react'
import styles from './delete.module.scss'
import { Poppins, Oxygen } from 'next/font/google'
import { useMutation } from '@apollo/client'
import { DeleteUser as DeleteUserAccount } from '@/lib/util/User/user.mutation'
import { getAllUserQuery } from '@/lib/util/User/user.query'


const poppins = Poppins({
    weight: "500",
    subsets: [ "latin" ]
})

const oxygen = Oxygen({
    weight: "400",
    subsets: [ "latin" ]
})
export default function DeleteUser({ userID, close, mUser }: any) {


    const [ deleteUserMutation ] = useMutation(DeleteUserAccount)
    const onHandleDeleteItems = (e: SyntheticEvent) => {
        e.preventDefault();
        deleteUserMutation({
            variables: {
                userId: userID,
                main: mUser
            },
            onCompleted: () => {
                alert("Successfully Deleted")
            },
            refetchQueries: [ getAllUserQuery ]
        })
    }
    return (
        <div className={styles.container}>

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
