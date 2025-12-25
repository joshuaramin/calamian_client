"use client"

import React, { useState } from 'react'
import { useMutation } from "@apollo/client/react"
import { Authentication } from '@/lib/apollo/Authentication/authenticate.mutaiton'
import { useRouter } from 'next/router'
import styles from './form.module.scss'
import store from 'store2'
import z from 'zod'
import { LoginSchema } from '@/lib/validation/AuthSchema'
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { oxygen, poppins, rubik } from '@/lib/typography'
import Cookies from 'js-cookie'
import { InputText } from '@/components/input'
import ToastNotification from '@/components/toastNotification'
import toast from 'react-hot-toast'




type LoginFormValues = z.infer<typeof LoginSchema>

export default function Form() {

    const router = useRouter()
    const years = new Date().getFullYear()

    const [toggle, setToggle] = useState(false)
    const onToggleEvent = () => {
        setToggle(() => !toggle)
    }

    const { register, formState: { errors }, handleSubmit } = useForm<LoginFormValues>({
        resolver: zodResolver(LoginSchema)
    })


    const [Authenticate, { error, loading, data }] = useMutation(Authentication)

    const onHandleSubmitForm: SubmitHandler<LoginFormValues> = (data) => {
        Authenticate({
            variables: {
                input: {
                    email: data.email,
                    password: data.password
                }
            },
            onCompleted: (data) => {

                const login = data?.login;

                if (!login) {
                    toast.error("Unexpected server response");
                    return;
                }

                if (login.message) {
                    toast.error(login.message);
                    return;
                }

                toast.success("Successfully Logged In");

                store.set("UserAccount", {
                    user_id: login.user.userID,
                    email: login.user.email,
                    profile: {
                        fullname: login.user.myProfile.fullname,
                    },
                    user_role: login.user.role,
                });

                Cookies.set("pha_tkn", login.token);

                switch (login.user.role) {
                    case "admin":
                    case "manager":
                        router.push("/dashboard/overview");
                        break;
                    default:
                        router.push("/dashboard/staff");
                        break;
                }

            }
        })
    }

    // const dataStore = useLocalStorageValue("credentials", {
    //     defaultValue: {
    //         username: "",
    //         password: "",
    //         checked: toggle
    //     }
    // })


    // const onRememberME = () => {

    //     dataStore.set({
    //         username: users.email,
    //         password: users.password,
    //         checked: true
    //     })

    // }


    return (
        <div className={styles.container}>
            <div className={styles.con}>
                <div className={styles.intro}>
                    <h2 className={rubik.className}>Welcome</h2>
                    <span className={oxygen.className}>

                        Efficiently manage your store with enhanced speed and optimized productivity.
                    </span>
                </div>
                <form onSubmit={handleSubmit(onHandleSubmitForm)}>
                    <InputText
                        icon={false}
                        label={'Email Address'}
                        name={'email'}
                        isRequired={true}
                        error={errors.email}
                        register={register}
                        type='text'
                    />
                    <InputText
                        icon={false}
                        label={'Password'}
                        name={'password'}
                        isRequired={true}
                        error={errors.password}
                        register={register}
                        type='password'
                    />
                    <div className={styles.rememberMe}>
                        <input type="checkbox" className={styles.checkBox} onClick={onToggleEvent} />
                        <label className={oxygen.className}>Remember Me</label>
                    </div>
                    <button disabled={loading} type="submit">
                        <span className={oxygen.className}>{loading && data ? "Logging In" : "Login"} </span>
                    </button>
                </form>
            </div >
            <div className={styles.copyright}>
                <span className={poppins.className}>&copy; {years} ALL RIGHTS RESERVED</span>
            </div>
            <ToastNotification />
        </div >
    )
}
