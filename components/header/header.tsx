import React, { useState, useEffect } from 'react'
import { TbBell, TbSettings, TbChevronDown, TbChevronUp, TbLogout, TbBellRinging } from 'react-icons/tb'
import { Oxygen, Poppins } from 'next/font/google'
import { client } from '@/lib/apolloWrapper'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import { ProfileByUserId } from '@/lib/util/User/profile/profile.query'
import { jwtDecode } from 'jwt-decode'
import { GetAllNotification, GetAllUnreadNotification } from '@/lib/util/notification/notification.query'
import styles from './header.module.scss'
import Cookies from 'js-cookie'
import Notifications from './notification/notification'


const poppins = Poppins({
    weight: "500",
    subsets: [ "latin" ]
})

const oxygen = Oxygen({
    weight: "400",
    subsets: [ "latin" ]
})

export default function Header() {
    const router = useRouter();


    const notificationValue = [
        { name: "All", value: "all" },
        { name: "Unread", value: "unread" }
    ]

    const onHandleLogout = () => {

        Cookies.remove("pha_tkn");
        client.resetStore()
        router.push("/")

    }
    const [ roles, setRoles ] = useState("")
    const [ toggle, setToggle ] = useState(false)
    const [ userid, setUserId ] = useState("")
    const [ notification, setNotification ] = useState(false)
    const [ notif, setNotif ] = useState("all")

    const onHandleNotification = () => {
        setNotification(() => !notification)
    }
    useEffect(() => {
        const cookies = Cookies.get("pha-tkn") as any
        const { userId, role }: any = jwtDecode(cookies)
        setUserId(userId)
        setRoles(role)

    }, [ userid, roles ])


    const { loading, data } = useQuery(ProfileByUserId, {
        variables: {
            userId: userid
        }
    })

    const { loading: notificationLoad, data: notificationData } = useQuery(GetAllNotification, {
        pollInterval: 5000
    })
    const { loading: notificaitonUnreadLoad, data: notificationUnreadData } = useQuery(GetAllUnreadNotification, {
        pollInterval: 5000
    })
    return (
        <div className={styles.container}>
            {roles === "manager" ? null : <div className={styles.profileSettings}>
                <button onClick={onHandleNotification}>
                    <TbBell size={30} />
                    {notificationUnreadData?.getAllUnreadNotification.length > 0 ? <div className={styles.notificationBadge} /> : null}
                </button>
            </div>}
            {
                notification ?
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
                                    </> : null
                            }
                        </div>
                        <div className={styles.notificationFooter}>
                            <button onClick={() => router.push("/dashboard/admin/notification")}>
                                <span className={oxygen.className}>See All</span>
                            </button>
                        </div>
                    </div>
                    : null
            }

            <div onClick={() => setToggle(() => !toggle)} className={styles.profile}>
                {loading ? "" : data.getProfileByUserId.map(({ profileID, fullname }: any) => (
                    <h2 key={profileID} className={poppins.className}>{fullname}</h2>
                ))}
                {toggle ? <TbChevronUp size={25} /> : <TbChevronDown size={25} />}
            </div>
            {
                toggle ?
                    <div className={styles.logoutContainer}>
                        <div className={styles.profileCon}>
                            <div className={styles.prof}>
                                {loading ? "" : data.getProfileByUserId.map(({ profileID, fullname, firstname, lastname }: any) => (
                                    <div key={profileID}>
                                        <div className={styles.avatar}>
                                            <span className={poppins.className}>{firstname[ 0 ]}{lastname[ 0 ]}</span>
                                        </div>
                                        <h2 className={poppins.className}>{fullname}</h2>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <hr />
                        <button className={styles.settingsBtn} onClick={() => router.push("/dashboard/admin/settings")}>
                            <TbSettings size={20} />
                            <span className={oxygen.className}>Settings</span>
                        </button>
                        <hr />
                        <button className={styles.logout} onClick={onHandleLogout}>
                            <TbLogout size={20} />
                            <span className={oxygen.className}>Logout</span>
                        </button>
                    </div>
                    :
                    null
            }
        </div>
    )
}
