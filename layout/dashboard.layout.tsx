import React, { ReactNode, useState } from 'react'
import styles from '@/styles/layout/dashboard.module.scss'
import Sidebar from '@/components/sidebar/sidebar'
import Header from '@/components/header/header'
interface DashboardLayout {
    children: ReactNode
}





export default function Dashboard({ children }: DashboardLayout) {

    const [ isDark, setDark ] = useState(true)

    const onHandleTheme = () => {
        setDark(() => !isDark)
    }
    return (
        <div className={styles.container}>
            <Sidebar />
            <div className={styles.body}>
                <Header/>
                {children}
            </div>
        </div>
    )
}
