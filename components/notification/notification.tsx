import { formatDistance, subDays } from 'date-fns'
import { Poppins, Oxygen } from 'next/font/google'
import { getNotificationUpdate } from '@/lib/apollo/notification/notification.mutation'
import { GetAllNotification, GetAllUnreadNotification } from '@/lib/apollo/notification/notification.query'
import React, { SyntheticEvent } from 'react'
import styles from '@/styles/layout/notificationLayout.module.scss'
import { useMutation } from '@apollo/client'

const poppins = Poppins({
    weight: "500",
    subsets: ["latin"]
})

const oxygen = Oxygen({
    weight: "400",
    subsets: ["latin"]
})

export default function Notifications({ notificationID, notification, createdAt, notifStatus }:
    { notificationID: string, notification: string, createdAt: any, notifStatus: string }) {

    const [mutate] = useMutation(getNotificationUpdate, {
        variables: {
            notificationId: notificationID
        },
        refetchQueries: [GetAllNotification, GetAllUnreadNotification]
    })


    const onUpdateNotification = (e: SyntheticEvent) => {
        e.preventDefault();
        mutate()
    }
    return (
        <div onClick={onUpdateNotification} style={notifStatus === "unread" ? { backgroundColor: "#f5f5f5" } : {}} key={notificationID} className={styles.notificationCard}>
            <h2 className={poppins.className}>Calamian MDs Pharmacy System</h2>
            <p className={oxygen.className}>
                {notification}
            </p>
            <span className={oxygen.className}>{formatDistance(subDays(new Date(createdAt), 0), new Date(), { addSuffix: true })}</span>
        </div>
    )
}
