import NotificationLayout from '@/layout/notification.layout'
import PageWithLayout from '@/layout/page.layout'
import React, { FC, useState } from 'react'
import styles from '@/styles/layout/notificationLayout.module.scss'
import { Poppins, Oxygen } from 'next/font/google'
import Notifications from '@/components/notification/notification'
import { TbBellRinging } from 'react-icons/tb'
import { GetAllNotification, GetAllUnreadNotification } from '@/lib/util/notification/notification.query'
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import Head from 'next/head'

const poppins = Poppins({
    weight: "500",
    subsets: [ "latin" ]
})

const oxygen = Oxygen({
    weight: "400",
    subsets: [ "latin" ]
})

const notificationValue = [
    { name: "All", value: "all" },
    { name: "Unread", value: "unread" }
]



const Notification: FC = () => {

    const [ notif, setNotif ] = useState("all")
    const router = useRouter();
    const { loading: notificationLoad, data: notificationData } = useQuery(GetAllNotification, {
        pollInterval: 5000
    })
    const { loading: notificaitonUnreadLoad, data: notificationUnreadData } = useQuery(GetAllUnreadNotification, {
        pollInterval: 5000
    })


    if (notificaitonUnreadLoad || notificationLoad) return <p>Loading...</p>

    return (
        <div className={styles.container}>
            <Head>
                <title>Notification</title>
            </Head>
            <div className={styles.notification}>
                <div className={styles.notificationHeader}>
                    <h2 className={poppins.className}>Notifications</h2>
                    <div className={styles.btnGrp}>
                        {notificationValue.map(({ name, value }) => (
                            <button className={value === notif ? styles.actives : ''} key={name} onClick={(e) => setNotif(e.currentTarget.value)} value={value}>{name}</button>
                        ))}
                    </div>
                </div>
                <div className={styles.notificationBody}>
                    {notif === "all" ?
                        <>
                            {notificationData.getAllNotification.length === 0 ?
                                <div className={styles.noNotification}>
                                    <TbBellRinging size={40} />
                                    <h2 className={poppins.className}>No notification yet</h2>
                                    <span className={oxygen.className}>When you get notification, they{"'"}ll show up here</span>
                                </div> :
                                notificationLoad ? "" : notificationData.getAllNotification.map(({ notificationID, notification, createdAt, notifStatus }: { notificationID: string, notification: string, createdAt: any, notifStatus: string }) => (
                                    <Notifications key={notificationID} notificationID={notificationID} notification={notification} createdAt={createdAt} notifStatus={notifStatus} />
                                ))}
                        </> : null}

                    {
                        notif === "unread" ?
                            <>
                                {notificationUnreadData.getAllUnreadNotification.length === 0 ?
                                    <div className={styles.noNotification}>
                                        <TbBellRinging size={40} />
                                        <h2 className={poppins.className}>No notification yet</h2>
                                        <span className={oxygen.className}>When you get notification, they{"'"}ll show up here</span>
                                    </div> : notificaitonUnreadLoad ? "" : notificationUnreadData.getAllUnreadNotification.map(({ notificationID, notification, createdAt, notifStatus }: { notificationID: string, notification: string, createdAt: any, notifStatus: string }) => (
                                        <Notifications key={notificationID} notificationID={notificationID} notification={notification} createdAt={createdAt} notifStatus={notifStatus} />

                                    ))}
                            </> :
                            null
                    }
                </div>
            </div>
            <button onClick={() => router.back()} className={styles.goback}>
                <span className={oxygen.className}>Go Back to Dashboard</span>
            </button>
        </div>
    )
}

(Notification as PageWithLayout).layout = NotificationLayout
export default Notification
