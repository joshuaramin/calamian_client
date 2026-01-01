"use client"

import NotificationLayout from '@/layout/notification.layout'
import PageWithLayout from '@/layout/page.layout'
import React, { FC, useState } from 'react'
import styles from '@/styles/layout/notificationLayout.module.scss'
import { Poppins, Oxygen } from 'next/font/google'
import Notifications from '@/components/notification/notification'
import { TbBellRinging } from 'react-icons/tb'
import { GetAllNotification, GetAllUnreadNotification } from '@/lib/apollo/notification/notification.query'
import { useQuery } from '@apollo/client/react'
import { useRouter } from 'next/router'
import Head from 'next/head'

// Fonts
const poppins = Poppins({ weight: "500", subsets: ["latin"] })
const oxygen = Oxygen({ weight: "400", subsets: ["latin"] })

// Notification tabs
const notificationValue = [
    { name: "All", value: "all" },
    { name: "Unread", value: "unread" }
]

// Types
type NotificationItem = {
    notificationID: string
    notification: string
    createdAt: string
    notifStatus: string
}

type GetAllNotificationQuery = {
    getAllNotification: NotificationItem[]
}

type GetAllUnreadNotificationQuery = {
    getAllUnreadNotification: NotificationItem[]
}

const Notification: FC = () => {
    const [notif, setNotif] = useState<"all" | "unread">("all")
    const router = useRouter()

    // Queries
    const { loading: allLoading, data: allData } = useQuery<GetAllNotificationQuery>(GetAllNotification, {
        pollInterval: 5000
    })

    const { loading: unreadLoading, data: unreadData } = useQuery<GetAllUnreadNotificationQuery>(GetAllUnreadNotification, {
        pollInterval: 5000
    })

    // Loading state
    if (allLoading || unreadLoading) return <p>Loading...</p>

    // Choose data to display based on current tab
    const notificationsToDisplay = notif === "all" ? allData?.getAllNotification : unreadData?.getAllUnreadNotification

    return (
        <div className={styles.container}>
            <Head>
                <title>Notification</title>
            </Head>

            <div className={styles.notification}>
                {/* Header */}
                <div className={styles.notificationHeader}>
                    <h2 className={poppins.className}>Notifications</h2>
                    <div className={styles.btnGrp}>
                        {notificationValue.map(({ name, value }) => (
                            <button
                                key={name}
                                value={value}
                                className={value === notif ? styles.actives : ''}
                                onClick={(e) => setNotif(e.currentTarget.value as "all" | "unread")}
                            >
                                {name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Body */}
                <div className={styles.notificationBody}>
                    {notificationsToDisplay && notificationsToDisplay.length > 0 ? (
                        notificationsToDisplay.map(({ notificationID, notification, createdAt, notifStatus }) => (
                            <Notifications
                                key={notificationID}
                                notificationID={notificationID}
                                notification={notification}
                                createdAt={createdAt}
                                notifStatus={notifStatus}
                            />
                        ))
                    ) : (
                        <div className={styles.noNotification}>
                            <TbBellRinging size={40} />
                            <h2 className={poppins.className}>No notification yet</h2>
                            <span className={oxygen.className}>
                                When you get notifications, they'll show up here
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Go back button */}
            <button onClick={() => router.back()} className={styles.goback}>
                <span className={oxygen.className}>Go Back to Dashboard</span>
            </button>
        </div>
    )
}

// Apply layout
(Notification as PageWithLayout).layout = NotificationLayout
export default Notification
