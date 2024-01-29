import React from 'react'
import styles from './logout.module.scss'
import { Poppins } from 'next/font/google'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { client } from '@/lib/apolloWrapper'

const poppins = Poppins({
    weight: "500",
    subsets: [ "latin" ]
})
export default function Settings({ close }: any) {

    const router = useRouter()

    const onHandleRemoveCookies = () => {
        Cookies.remove("pha-tkn");
        client.resetStore()
        router.push("/")

    }

    return (
        <div className={styles.container}>
            <h2 className={poppins.className}>Do you want to logout?</h2>
            <div className={styles.logout}>
                <button onClick={close} className={styles.cancel}>
                    <span>Cancel</span>
                </button>
                <button onClick={onHandleRemoveCookies} className={styles.approved}>
                    <span>Yes</span>
                </button>
            </div>
        </div>
    )
}
