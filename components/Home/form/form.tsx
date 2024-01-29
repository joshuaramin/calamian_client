"use client"
import React, { SyntheticEvent, useState } from 'react'
import { Oxygen, Rubik, Poppins } from 'next/font/google'
import { useMutation } from "@apollo/client"
import { Authentication } from '@/lib/util/Authentication/authenticate.mutaiton'
import { useLocalStorageValue } from "@react-hookz/web"
import { jwtDecode } from 'jwt-decode'
import { useRouter } from 'next/router'
import styles from './form.module.scss'
import Cookies from 'js-cookie'
const rubik = Rubik({
    display: "auto",
    subsets: [ "latin" ],
    style: "normal",
    weight: "600"
})

const oxygen = Oxygen({
    weight: "400",
    display: "auto",
    subsets: [ "latin" ]
})


const poppins = Poppins({
    weight: "400",
    style: "normal",
    subsets: [ "latin" ]
})


export default function Form() {

    const router = useRouter()

    const years = new Date().getFullYear()
    const [ users, setUsers ] = useState({
        email: "",
        password: ""
    })
    const [ toggle, setToggle ] = useState(false)
    const onToggleEvent = () => {
        setToggle(() => !toggle)
    }
    const [ Authenticate, { error, loading, data } ] = useMutation(Authentication)

    const onHandleSubmitForm = (e: SyntheticEvent) => {
        e.preventDefault();
        Authenticate({
            variables: {
                email: !dataStore.value?.username ? users.email : dataStore.value?.username,
                password: !dataStore.value?.password ? users.password : dataStore.value?.password,
            },
            errorPolicy: "all",
            onCompleted: (data) => {



                Cookies.set("pha-tkn", data.login.token, {
                    httpOnly: false,
                    path: "/",
                    sameSite: "none",
                    secure: true
                })

                console.log(data)
                const { role }: any = jwtDecode(data.login.token)

                if (role === "admin") {
                    router.push(`/dashboard/admin/overview`)
                } else if (role === "manager") {
                    router.push(`/dashboard/manager/overview`)
                } else {
                    router.push(`/dashboard/staff`)
                }


            }
        })
    }





    const dataStore = useLocalStorageValue("credentials", {
        defaultValue: {
            username: "",
            password: "",
            checked: toggle
        }
    })


    const onRememberME = () => {

        dataStore.set({
            username: users.email,
            password: users.password,
            checked: true
        })

    }


    return (
        <div className={styles.container}>
            <div className={styles.con}>
                {error ?
                    <div className={styles.message}>
                        <span>{error?.message}</span>
                    </div> : null}
                <div className={styles.intro}>
                    <h2 className={rubik.className}>Welcome</h2>
                    <span className={oxygen.className}>

                        Efficiently manage your store with enhanced speed and optimized productivity.
                    </span>
                </div>
                <form onSubmit={onHandleSubmitForm}>
                    <input className={`${styles.inputForm} ${oxygen.className}`} defaultValue={!dataStore.value?.username ? users.email : dataStore.value?.username} type="email" placeholder='Email Address' onChange={(e) => setUsers({ ...users, email: e.target.value })} />
                    <input className={`${styles.inputForm} ${oxygen.className}`} defaultValue={!dataStore.value?.password ? users.password : dataStore.value?.password} type="password" placeholder='Password' onChange={(e) => setUsers({ ...users, password: e.target.value })} />
                    <div className={styles.rememberMe}>
                        <input type="checkbox" className={styles.checkBox} onClick={onToggleEvent} defaultChecked={dataStore.value?.checked === true ? true : false} onChange={onRememberME} />
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
