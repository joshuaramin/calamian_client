import React, { FC, useEffect, useState } from 'react'
import SettingLayout from '@/layout/settings.layout'
import PageWithLayout from '@/layout/page.layout'
import styles from '@/styles/dashboard/settings/settings.module.scss'
import Accounts from '@/lib/ui/settings/accounts'
import MyProfile from '@/lib/ui/settings/myprofile'
import ActivityLogs from '@/lib/ui/settings/logs'
import { TbLogout, TbX } from 'react-icons/tb'
import { Oxygen, Poppins } from 'next/font/google'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import { client } from '@/lib/apollo/apolloWrapper'
import Head from 'next/head'
import store from 'store2'
const oxygen = Oxygen({
    weight: "400",
    subsets: ["latin"]
})

const poppins = Poppins({
    weight: "500",
    subsets: ["latin"]
})


const settingAcc = [
    { name: "Account", value: "accounts" },
    { name: "My Profile", value: "profiles" },
    { name: "Activity Logs", value: "logs" },

]
const Settings: FC = () => {

    const [userId, setUserId] = useState("");
    const router = useRouter();

    const user = store.get("UserAccount");


    useEffect(() => {
        setUserId(user.user_id)
    }, [user.user_id])


    const [accounts, setAccounts] = useState("accounts");

    const onHandleLogoutBtn = () => {
        client.resetStore();
        Cookies.remove("pha-tkn")
        router.push("/")
    }
    return (
        <div className={styles.container}>
            <Head>
                <title>Settings</title>
            </Head>
            <div className={styles.divContainer}>
                <div className={styles.sidebar}>
                    <h2 className={poppins.className}>User Settings</h2>
                    <div className={styles.sidebarContainer}>

                        {settingAcc.map(({ name, value }) => (
                            <button key={name} value={value} onClick={(e) => setAccounts(e.currentTarget.value)} className={accounts === value ? `${styles.active}` : `${styles.sidebarBtn}`}>
                                <span className={oxygen.className}>{name}</span>
                            </button>
                        ))}
                    </div>
                    <hr />
                    <button onClick={onHandleLogoutBtn} type="button" className={styles.logoutBtn}>
                        <TbLogout size={23} />
                        <span className={oxygen.className}>Logout</span>
                    </button>
                    <hr />
                    <div className={styles.versioning}>
                        <span className={`${oxygen.className} ${styles.systemVersion}`}>Version 1.0.0</span>
                    </div>
                </div>
                <div className={styles.content}>
                    <div className={styles.headclose}>
                        <button onClick={() => router.back()} className={styles.settingClosed}>
                            <TbX size={23} />
                        </button>
                    </div>
                    <div className={styles.aa}>
                        {accounts === "accounts" ? <Accounts userID={userId} /> : null}
                        {accounts === "profiles" ? <MyProfile userID={userId} /> : null}
                        {accounts === "logs" ? <ActivityLogs userID={userId} /> : null}
                    </div>
                </div>
            </div>
        </div>
    )
}


(Settings as PageWithLayout).layout = SettingLayout
export default Settings
