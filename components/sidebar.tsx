import React, { useEffect, useState } from 'react'
import styles from '@/styles/components/sidebar.module.scss'
import { TbBox, TbLayoutDashboard, TbUser, TbMoneybag, TbShoppingCart, TbArchive } from 'react-icons/tb'
import { useRouter } from 'next/router'
import { jwtDecode } from 'jwt-decode'
import Cookies from 'js-cookie'
import { poppins } from '@/lib/typography'


const Links = [
    {
        name: "Dashboard", icon: <TbLayoutDashboard size={24} />,
        url: "/dashboard/overview", shortcut: "overview",
        role: ["administrator", "manager"]
    },
    {
        name: "Inventory", icon: <TbBox size={24} />,
        url: "/dashboard/inventory", shortcut: "inventory",
        role: ["administrator", "manager"]
    },
    {
        name: "Finance", icon: <TbMoneybag size={24} />,
        url: "/dashboard/finance", shortcut: "finance",
        role: ["administrator", "manager"]
    },
    {
        name: "Orders", icon: <TbShoppingCart size={24} />,
        url: "/dashboard/orders", shortcut: "orders",
        role: ["administrator", "manager"]
    },
    {
        name: "Users", icon: <TbUser size={24} />,
        url: "/dashboard/users", shortcut: "users",
        role: ["administrator", "manager"]
    },
    {
        name: "Archive", icon: <TbArchive size={24} />, url: "/dashboard/archive", shortcut: "archive",
        role: ["administrator"]
    }
]


export default function Sidebar() {


    const router = useRouter();
    const [role, setRoles] = useState("")

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

                {
                    Links.map(({ name, icon, url, shortcut, role }) => (
                        <button className={router.asPath.includes(shortcut) ? styles.activeBtn
                            : ""} key={name} onClick={() => router.push(url)}>
                            {icon}
                            <span className={poppins.className}>{name}</span>
                        </button>
                    ))
                }
            </ul>
        </div>
    )
}
