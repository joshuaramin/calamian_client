import React, { useEffect, useState } from 'react'
import styles from './sidebar.module.scss'
import { TbBoxSeam, TbLayoutDashboard, TbChartBar, TbUser, TbMoneybag, TbShoppingCart, TbArchive } from 'react-icons/tb'
import { useRouter } from 'next/router'
import { Poppins } from 'next/font/google'
import { jwtDecode } from 'jwt-decode'
import Cookies from 'js-cookie'
const poppins = Poppins({
    weight: "400",
    subsets: [ "latin" ]
})

const Adminlink = [
    {
        name: "Dashboard", icon: <TbLayoutDashboard size={24} />,
        url: "/dashboard/admin/overview", shortcut: "overview"
    },
    {
        name: "Inventory", icon: <TbBoxSeam size={24} />,
        url: "/dashboard/admin/inventory", shortcut: "inventory"
    },
    {
        name: "Finance", icon: <TbMoneybag size={24} />,
        url: "/dashboard/admin/finance", shortcut: "finance"
    },
    {
        name: "Orders", icon: <TbShoppingCart size={24} />,
        url: "/dashboard/admin/orders", shortcut: "orders"
    },
    {
        name: "Users", icon: <TbUser size={24} />,
        url: "/dashboard/admin/users", shortcut: "users"
    },
    {
        name: "Archive", icon: <TbArchive size={24} />, url: "/dashboard/admin/archive", shortcut: "archive"
    }
]


const ManagerLink = [
    {
        name: "Dashboard", icon: <TbLayoutDashboard size={24} />,
        url: "/dashboard/manager/overview", shortcut: "overview"
    },
    {
        name: "Inventory", icon: <TbBoxSeam size={24} />,
        url: "/dashboard/manager/inventory", shortcut: "inventory"
    },
    {
        name: "Finance", icon: <TbMoneybag size={24} />,
        url: "/dashboard/manager/finance", shortcut: "finance"
    },
    {
        name: "Orders", icon: <TbShoppingCart size={24} />,
        url: "/dashboard/manager/orders", shortcut: "orders"
    },
    {
        name: "Users", icon: <TbUser size={24} />,
        url: "/dashboard/manager/users", shortcut: "users"
    },
]

export default function Sidebar() {


    const router = useRouter();
    const [ role, setRoles ] = useState("")

    useEffect(() => {
        const cookies = Cookies.get("pha-tkn")
        if (cookies) {
            const { role }: { role: string } = jwtDecode(cookies)

            setRoles(role)
        }
    }, [])


    return (
        <div className={styles.container}>
            <div className={styles.company}>
                <h2 className={poppins.className}>Calamian MDs Pharmacy</h2>
            </div>
            <ul>
                {role === "manager" ? ManagerLink.map(({ name, icon, url, shortcut }) => (
                    <button className={router.asPath.includes(shortcut) ? styles.activeBtn
                        : ""} key={name} onClick={() => router.push(url)}>
                        {icon}
                        <span className={poppins.className}>{name}</span>
                    </button>
                )) : null}
                {role === "admin" ?
                    Adminlink.map(({ name, icon, url, shortcut }) => (
                        <button className={router.asPath.includes(shortcut) ? styles.activeBtn
                            : ""} key={name} onClick={() => router.push(url)}>
                            {icon}
                            <span className={poppins.className}>{name}</span>
                        </button>
                    ))
                    : null}
            </ul>
        </div>
    )
}
