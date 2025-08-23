import React, { FC, useState } from 'react'
import Dashboard from '@/layout/dashboard.layout'
import PageWithLayout from '@/layout/page.layout'
import styles from '@/styles/dashboard/archive/archive.module.scss'
import { Poppins } from 'next/font/google'
import UserArchive from '@/lib/ui/archive/User/user'
import ItemsArchive from '@/lib/ui/archive/Items/Items'
import ExpenseArchive from '@/lib/ui/archive/Expense/Expense'
import CategoriesArchive from '@/lib/ui/archive/Categories/categories'
import { GetServerSidePropsContext } from 'next'
import { jwtDecode } from 'jwt-decode'
import Head from 'next/head'



const poppins = Poppins({
    weight: "500",
    subsets: ["latin"]
})

const headerTabs = ["Users", "Items", "Expense Folder", "Categories"]
const Archive: FC = ({ userIds }: any) => {

    const [headerTabsValue, setHeaderTabValue] = useState("Users")
    return (
        <div className={styles.container}>
            <Head>
                <title>Archive</title>
            </Head>
            <div className={styles.containerHeader}>
                {headerTabs.map((name) => (
                    <button onClick={(e) => setHeaderTabValue(e.currentTarget.value)} className={headerTabsValue === name ? styles.active : ""} value={name} key={name}>
                        <span className={poppins.className}>{name}</span>
                    </button>
                ))}

            </div>
            {headerTabsValue === "Users" ? <UserArchive userIds={userIds} /> : null}
            {headerTabsValue === "Items" ? <ItemsArchive userIds={userIds} /> : null}
            {headerTabsValue === "Expense Folder" ? <ExpenseArchive userIds={userIds} /> : null}
            {headerTabsValue === "Categories" ? <CategoriesArchive userIds={userIds} /> : null}
        </div>
    )
}

(Archive as PageWithLayout).layout = Dashboard
export default Archive


export const getServerSideProps = async (context: GetServerSidePropsContext) => {

    const cookies = context.req.cookies["pha-tkn"]

    const { userId }: any = jwtDecode(cookies as any)

    return {
        props: {
            userIds: userId
        }
    }

}