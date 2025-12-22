import React, { SyntheticEvent, useEffect, useState } from 'react'
import styles from './accounts.module.scss'
import { UpdateUserEmailAddress, UpdateUserPassword } from '@/lib/apollo/User/user.mutation'
import { useMutation } from '@apollo/client/react'
import Message from '@/components/message/message'
import { poppins } from '@/lib/typography'
import { InputText } from '@/components/input'
import toast from 'react-hot-toast'
import { SubmitHandler, useForm } from 'react-hook-form'
import z from 'zod'
import { UserPassword, UserSchema } from '@/lib/validation/UserSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import store from 'store2'


type UserFormValue = z.infer<typeof UserSchema>
type UserPasswordFormValue = z.infer<typeof UserPassword>

export default function Accounts() {

    const [userID, setUserID] = useState("");

    useEffect(() => {
        const user = store.get("UserAccount")

        setUserID(user.user_id)
    }, [userID])

    const [pass, setPassword] = useState({
        current: "",
        password: "",
        retypepass: ""
    })
    const [message, setMessage] = useState<Boolean>(false)
    const [emailMutate, { data: EmailData }] = useMutation(UpdateUserEmailAddress)
    const [passwordMutate, { data: PasswordData }] = useMutation(UpdateUserPassword)


    const { register: emailRegister, handleSubmit: emailHandleSubmit, formState: { errors: emailError }, reset: emailReset } = useForm<UserFormValue>({
        resolver: zodResolver(UserSchema),
        defaultValues: {
            email: ""
        }
    })

    const { register: passwordRegister, handleSubmit: passwordHandleSubmit, formState: { errors: passwordError }, reset } = useForm<UserPasswordFormValue>({
        resolver: zodResolver(UserPassword),
        defaultValues: {
            current: "",
            password: "",
            retype: ""
        }
    })

    const onChangePasswordForm: SubmitHandler<UserPasswordFormValue> = (data) => {
        passwordMutate({
            variables: {
                userId: userID,
                currentPasword: data.current,
                password: data.password,
                retype: data.retype
            },
            onError: (e) => {
                alert(e.message)
            },
            onCompleted: () => {
                setMessage(true)
                toast.success("Successfully Password Updated");
                setPassword({
                    current: "",
                    password: "",
                    retypepass: ""
                })
            },
        })
    }


    const onHandleEmailAddress: SubmitHandler<UserFormValue> = (data) => {
        emailMutate({
            variables: {
                email: data.email,
                userId: userID
            },
            errorPolicy: "all",
            onCompleted: () => {
                toast.success("Successffully Email Address Updated")
            }
        })
    }

    return (
        <div className={styles.container}>
            {EmailData && message === true ? <Message msg="Successfully Updated" /> : null}
            {PasswordData && message === true ? <Message msg="Successfully Updated" /> : null}
            <div className={styles.header}>
                <h2 className={poppins.className}>Account</h2>
            </div>
            <div className={styles.email}>
                <form onSubmit={emailHandleSubmit(onHandleEmailAddress)}>
                    <InputText
                        icon={false}
                        label={'Email Address'}
                        name={'email'}
                        isRequired={false}
                        error={emailError.email}
                        register={emailRegister}
                        type='text'
                    />
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
                        <form onSubmit={passwordHandleSubmit(onChangePasswordForm)}>
                            <InputText
                                icon={false}
                                label={'Current Password'}
                                name={'current'}
                                isRequired={false}
                                error={passwordError.current}
                                register={passwordRegister}
                                type='text'
                            />
                            <InputText
                                icon={false}
                                label={'New Password'}
                                name={'password'}
                                isRequired={false}
                                error={passwordError.password}
                                register={passwordRegister}
                                type='text'
                            />
                            <InputText
                                icon={false}
                                label={'Re-Type Password'}
                                name={'retype'}
                                isRequired={false}
                                error={passwordError.retype}
                                register={passwordRegister}
                                type='text'
                            />
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
