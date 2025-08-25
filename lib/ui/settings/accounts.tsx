import React, { SyntheticEvent, useEffect, useState } from 'react'
import styles from './accounts.module.scss'
import { Oxygen, Poppins } from 'next/font/google'
import { UpdateUserEmailAddress, UpdateUserPassword } from '@/lib/apollo/User/user.mutation'
import { useMutation } from '@apollo/client'
import Message from '@/components/message/message'
import { poppins, oxygen } from '@/lib/typography'

export default function Accounts({ userID }: any) {

    const [email, setEmail] = useState("")
    const [pass, setPassword] = useState({
        current: "",
        password: "",
        retypepass: ""
    })
    const [message, setMessage] = useState<Boolean>(false)
    const [emailMutate, { data: EmailData }] = useMutation(UpdateUserEmailAddress)
    const [passwordMutate, { data: PasswordData }] = useMutation(UpdateUserPassword)

    const onChangePasswordForm = (e: SyntheticEvent) => {
        e.preventDefault();
        passwordMutate({
            variables: {
                userId: userID,
                currentPasword: pass.current,
                password: pass.password,
                retype: pass.retypepass
            },
            onError: (e) => {
                alert(e.message)
            },
            onCompleted: () => {
                setMessage(true)
                alert("Successfully Updated");
                setPassword({
                    current: "",
                    password: "",
                    retypepass: ""
                })
            },
        })
    }

    const onChangeEmailAddressForm = (e: SyntheticEvent) => {
        e.preventDefault();
        emailMutate({
            variables: {
                email: email,
                userId: userID
            },
            onError(e) {
                alert(e.message)
            },
            onCompleted: () => {
                setMessage(true)
                setEmail("")
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
            {EmailData && message === true ? <Message msg="Successfully Updated" /> : null}
            {PasswordData && message === true ? <Message msg="Successfully Updated" /> : null}
            <div className={styles.header}>
                <h2 className={poppins.className}>Account</h2>
            </div>
            <div className={styles.email}>
                <h2 className={poppins.className}>Emaill Address</h2>
                <form onSubmit={onChangeEmailAddressForm}>
                    <input className={oxygen.className} type="email" value={email} placeholder='Email Address' onChange={(e) => setEmail(e.target.value)} />
                    <div className={styles.btn}>
                        <button type="submit" className={poppins.className}>Save</button>
                    </div>
                </form>
            </div>
            <div className={styles.password}>
                <div className={styles.passHeader}>
                    <h2 className={poppins.className}>Password</h2>
                </div>
                <div className={styles.pc}>
                    <div className={styles.pass}>
                        <form onSubmit={onChangePasswordForm}>
                            <input value={pass.current} type="password" onChange={(e) => setPassword({ ...pass, current: e.target.value })} placeholder='Current Password' />
                            <input value={pass.password} type="password" onChange={(e) => setPassword({ ...pass, password: e.target.value })} placeholder='New Password' />
                            <input value={pass.retypepass} type="password" onChange={(e) => setPassword({ ...pass, retypepass: e.target.value })} placeholder='Retype Password' />
                            <div className={styles.btn}>
                                <button type="submit" className={poppins.className}>Save</button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    )
}
