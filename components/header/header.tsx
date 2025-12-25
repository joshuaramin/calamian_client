import React, { useEffect, useState } from 'react'
import {
    TbBell,
    TbSettings,
    TbChevronDown,
    TbChevronUp,
    TbLogout,
    TbBellRinging
} from 'react-icons/tb'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client/react'
import Cookies from 'js-cookie'
import store from 'store2'

import { client } from '@/lib/apollo/apolloWrapper'
import { ProfileByUserId } from '@/lib/apollo/User/profile/profile.query'
import {
    GetAllNotification,
    GetAllUnreadNotification
} from '@/lib/apollo/notification/notification.query'

import Notifications from './notification/notification'
import Spinner from '../spinner'
import styles from './header.module.scss'
import { oxygen, poppins } from '@/lib/typography'

interface Notification {
    notificationID: string
    notification: string
    createdAt: string
    notifStatus: string
}

interface GetAllNotificationResponse {
    getAllNotification: Notification[]
}

interface GetAllUnreadNotificationResponse {
    getAllUnreadNotification: Notification[]
}

interface ProfileResponse {
    getProfileByUserId: {
        profileID: string
        firstname: string
        lastname: string
        fullname: string
    }
}

export default function Header() {
    const router = useRouter()

    /* -------------------- STATE -------------------- */
    const [roles, setRoles] = useState<string>("")
    const [userId, setUserId] = useState<string>("")
    const [toggle, setToggle] = useState(false)
    const [notification, setNotification] = useState(false)
    const [notif, setNotif] = useState<"all" | "unread">("all")

    /* -------------------- INIT USER -------------------- */
    useEffect(() => {
        const user = store.get("UserAccount")
        if (user) {
            setRoles(user.user_role)
            setUserId(user.user_id)
        }
    }, [])

    /* -------------------- QUERIES -------------------- */
    const {
        loading: profileLoading,
        data: profileData
    } = useQuery<ProfileResponse>(ProfileByUserId, {
        variables: { userId },
        skip: !userId
    })

    const {
        loading: notificationLoading,
        data: notificationData
    } = useQuery<GetAllNotificationResponse>(GetAllNotification, {
        skip: !userId
    })
    const {
        loading: unreadLoading,
        data: unreadNotificationData
    } = useQuery<GetAllUnreadNotificationResponse>(GetAllUnreadNotification, {
        skip: !userId
    })

    /* -------------------- HANDLERS -------------------- */
    const onHandleLogout = async () => {
        Cookies.remove("pha_tkn")
        store.clearAll()
        await client.clearStore()
        router.replace("/")
    }

    const notificationValue = [
        { name: "All", value: "all" },
        { name: "Unread", value: "unread" }
    ]

    /* -------------------- RENDER -------------------- */
    return (
        <div className={styles.container}>
            {/* NOTIFICATION ICON */}
            {roles !== "manager" && (
                <div className={styles.profileSettings}>
                    <button onClick={() => setNotification(!notification)}>
                        <TbBell size={30} />
                        {Array.isArray(unreadNotificationData?.getAllUnreadNotification) && unreadNotificationData.getAllUnreadNotification.length > 0 && (
                            <div className={styles.notificationBadge} />
                        )}
                    </button>
                </div>
            )}

            {/* NOTIFICATION DROPDOWN */}
            {notification && (
                <div className={styles.notification}>
                    <div className={styles.notificationHeader}>
                        <h2 className={poppins.className}>Notifications</h2>
                        <div className={styles.btnGrp}>
                            {notificationValue.map(({ name, value }) => (
                                <button
                                    key={value}
                                    className={value === notif ? styles.actives : ''}
                                    onClick={() => setNotif(value as "all" | "unread")}
                                >
                                    {name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.notificationBody}>
                        {/* ALL NOTIFICATIONS */}
                        {notif === "all" && (
                            notificationLoading ? null :
                                notificationData?.getAllNotification?.length === 0 ? (
                                    <div className={styles.noNotification}>
                                        <TbBellRinging size={40} />
                                        <h2 className={poppins.className}>No notification yet</h2>
                                        <span className={oxygen.className}>
                                            When you get notification, they&apos;ll show up here
                                        </span>
                                    </div>
                                ) : (
                                    notificationData?.getAllNotification?.map(
                                        ({ notificationID, notification, createdAt, notifStatus }: { notificationID: string, notification: string, createdAt: any, notifStatus: string }) => (
                                            <Notifications
                                                key={notificationID}
                                                notificationID={notificationID}
                                                notification={notification}
                                                createdAt={createdAt}
                                                notifStatus={notifStatus}
                                            />
                                        )
                                    )
                                )
                        )}

                        {/* UNREAD NOTIFICATIONS */}
                        {notif === "unread" && (
                            unreadLoading ? null :
                                unreadNotificationData?.getAllUnreadNotification?.length === 0 ? (
                                    <div className={styles.noNotification}>
                                        <TbBellRinging size={40} />
                                        <h2 className={poppins.className}>No notification yet</h2>
                                        <span className={oxygen.className}>
                                            When you get notification, they&apos;ll show up here
                                        </span>
                                    </div>
                                ) : (
                                    unreadNotificationData?.getAllUnreadNotification?.map(
                                        ({ notificationID, notification, createdAt, notifStatus }: { notificationID: string, notification: string, createdAt: any, notifStatus: string }) => (
                                            <Notifications
                                                key={notificationID}
                                                notificationID={notificationID}
                                                notification={notification}
                                                createdAt={createdAt}
                                                notifStatus={notifStatus}
                                            />
                                        )
                                    )
                                )
                        )}
                    </div>

                    <div className={styles.notificationFooter}>
                        <button onClick={() => router.push("/dashboard/notification")}>
                            <span className={oxygen.className}>See All</span>
                        </button>
                    </div>
                </div>
            )}

            {/* PROFILE */}
            {profileLoading ? (
                <Spinner heigth={35} width={35} />
            ) : (
                <div
                    onClick={() => setToggle(!toggle)}
                    className={styles.profile}
                >
                    <h2 className={poppins.className}>
                        {profileData?.getProfileByUserId?.fullname}
                    </h2>
                    {toggle ? <TbChevronUp size={25} /> : <TbChevronDown size={25} />}
                </div>
            )}

            {/* DROPDOWN */}
            {toggle && (
                <div className={styles.logoutContainer}>
                    <div className={styles.profileCon}>
                        <div className={styles.prof}>
                            <div>
                                <div className={styles.avatar}>
                                    <span className={poppins.className}>
                                        {profileData?.getProfileByUserId?.firstname?.[0]}
                                        {profileData?.getProfileByUserId?.lastname?.[0]}
                                    </span>
                                </div>
                                <h2 className={poppins.className}>
                                    {profileData?.getProfileByUserId?.fullname}
                                </h2>
                            </div>
                        </div>
                    </div>

                    <hr />

                    <button
                        className={styles.settingsBtn}
                        onClick={() => router.push("/dashboard/settings")}
                    >
                        <TbSettings size={20} />
                        <span className={oxygen.className}>Settings</span>
                    </button>

                    <hr />

                    <button
                        className={styles.logout}
                        onClick={onHandleLogout}
                    >
                        <TbLogout size={20} />
                        <span className={oxygen.className}>Logout</span>
                    </button>
                </div>
            )}
        </div>
    )
}
