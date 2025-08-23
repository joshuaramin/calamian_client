import React, { SyntheticEvent, useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { ResetDefaultPassword } from '@/lib/apollo/User/user.mutation'
import styles from '@/styles/dashboard/users/resetPassword.module.scss';
import { Poppins, Oxygen } from 'next/font/google'
import Message from '@/components/message/message'

const oxygen = Oxygen({
    weight: "400",
    subsets: ["latin"]
})


const poppins = Poppins({
    weight: "500",
    subsets: ["latin"]
})

export default function ResetPassword({ userID, close }: any) {

    const [UserMutation, { data }] = useMutation(ResetDefaultPassword)
    const [message, setMessage] = useState<Boolean>(false)

    const onHandleResetDefault = (e: SyntheticEvent) => {
        e.preventDefault();
        UserMutation({
            variables: {
                userId: userID
            },
            onCompleted: () => {
                setMessage(true)
            }
        })
    }


    useEffect(() => {
        const interval = setInterval(() => {
            setMessage(false)
        }, 2000);


        return () => clearInterval(interval)
    }, [message])

    return (
        <div className={styles.container}>
            {data && message == true ? <Message msg="Successfully Reset Password" /> : null}
            <div className={styles.header}>
                <h2 className={poppins.className}>Reset Password</h2>
                <span className={oxygen.className}>Resetting a user password to default, with the default password being the user{"'"}s birthday in <b>{"'"}YYYYMMDD{"'"}</b> format, provides a convenient and secure method for users to regain access to their accounts when they have forgotten their passwords. This approach combines user-friendliness with security, allowing individuals to easily reset their passwords by entering a personal and memorable date. The format <b>{"'"}YYYYMMDD{"'"}</b> ensures consistency and accuracy, enhancing the overall user experience.</span>
            </div>
            <form onSubmit={onHandleResetDefault}>
                <div className={styles.addBtnGrp}>
                    <button onClick={close} type="button" className={`${styles.cancelBtn} ${poppins.className}`}>Cancel</button>
                    <button type="submit" className={`${styles.addBtn} ${poppins.className}`}>Yes, Reset Password</button>
                </div>
            </form>
        </div>
    )
}
