import React, { SyntheticEvent, useState } from 'react'
import styles from './accounts.module.scss'
import { Oxygen, Poppins } from 'next/font/google'
import { UpdateUserEmailAddress, UpdateUserPassword } from '@/lib/util/User/user.mutation'
import { useMutation } from '@apollo/client'

const poppins = Poppins({
    weight: "500",
    subsets: [ "latin" ]
})

const oxygen = Oxygen({
    weight: "400",
    subsets: [ "latin" ]
})
export default function Accounts({ userID }: any) {

    const [ email, setEmail ] = useState("")
    const [ pass, setPassword ] = useState({
        current: "",
        password: "",
        retypepass: ""
    })

    const [ emailMutate ] = useMutation(UpdateUserEmailAddress)
    const [ passwordMutate ] = useMutation(UpdateUserPassword)

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
            }
        })
    }
    return (
        <div className={styles.container}>
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
