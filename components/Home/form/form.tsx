"use client"

import React, { useEffect, useState } from 'react'
import { Oxygen, Rubik, Poppins } from 'next/font/google'
import { useMutation } from "@apollo/client"
import { Authentication } from '@/lib/apollo/Authentication/authenticate.mutaiton'
import { useRouter } from 'next/router'
import styles from './form.module.scss'
import store from 'store2'
import Message from '@/components/message/message'
import z from 'zod'
import { LoginSchema } from '@/lib/validation/AuthSchema'
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { oxygen, poppins, rubik } from '@/lib/typography'
import Cookies from 'js-cookie'




type LoginFormValues = z.infer<typeof LoginSchema>

export default function Form() {

    const router = useRouter()
    const [message, setMessage] = useState<Boolean>(false)
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


                console.log(data)

                store.set("UserAccount", {
                    user_id: data.login.user.userID,
                    email: data.login.user.email,
                    profile: {
                        fullname: data.login.user.myProfile.fullname,
                    },
                    user_role: data.login.user.role
                })
                setMessage(true)

                Cookies.set("pha_tkn", data.login.token)


                const role = data.login.user.role

                switch (role) {
                    case "admin":
                        router.push(`/dashboard/overview`)
                        break;
                    case "manager":
                        router.push(`/dashboard/overview`)
                        break;
                    default:
                        router.push(`/dashboard/staff`)
                        break
                }


            }
        })
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setMessage(false)
        }, 2000);


        return () => clearInterval(interval)
    }, [message])



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
            {
                data && message == true ?
                    <Message msg="Successfully Login" /> : null
            }
            <div className={styles.con}>
                <div className={styles.intro}>
                    <h2 className={rubik.className}>Welcome</h2>
                    <span className={oxygen.className}>

                        Efficiently manage your store with enhanced speed and optimized productivity.
                    </span>
                </div>
                <form onSubmit={handleSubmit(onHandleSubmitForm)}>
                    <input className={`${styles.inputForm} ${oxygen.className}`} type="text" placeholder='Email Address'
                        {...register("email")} />
                    {errors && <div className={styles.message}>
                        <span>{errors?.email?.message}</span>
                    </div>}
                    <input className={`${styles.inputForm} ${oxygen.className}`} type="password" placeholder='Password'
                        {...register("password")} />
                    {errors && <div className={styles.message}>
                        <span>{errors?.password?.message}</span>
                    </div>}
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
        </div >
    )
}
