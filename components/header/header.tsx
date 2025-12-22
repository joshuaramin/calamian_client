import React, { useState, useEffect } from 'react'
import { TbBell, TbSettings, TbChevronDown, TbChevronUp, TbLogout, TbBellRinging } from 'react-icons/tb'
import { client } from '@/lib/apollo/apolloWrapper'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client/react'
import { ProfileByUserId } from '@/lib/apollo/User/profile/profile.query'
import { GetAllNotification, GetAllUnreadNotification } from '@/lib/apollo/notification/notification.query'
import styles from './header.module.scss'
import Cookies from 'js-cookie'
import Notifications from './notification/notification'
import store from 'store2'
import { oxygen, poppins } from '@/lib/typography'
import Spinner from '../spinner'


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
    const [roles, setRoles] = useState("")
    const [toggle, setToggle] = useState(false)
    const [userid, setUserId] = useState("")
    const [notification, setNotification] = useState(false)
    const [notif, setNotif] = useState("all")

    const onHandleNotification = () => {
        setNotification(() => !notification)
    }
    useEffect(() => {
        const user = store.get("UserAccount")
        setRoles(user.user_role)
        setUserId(user.user_id)

    }, [userid, roles])


    const { loading, data } = useQuery(ProfileByUserId, {
        variables: {
            userId: userid
        }
    })

    const { loading: notificationLoad, data: notificationData } = useQuery(GetAllNotification)
    const { loading: notificaitonUnreadLoad, data: notificationUnreadData } = useQuery(GetAllUnreadNotification)
    return (
        <div className={styles.container}>
            {roles === "manager" ? null : <div className={styles.profileSettings}>
                <button onClick={onHandleNotification}>
                    <TbBell size={30} />
                    {notificationUnreadData?.getAllUnreadNotification.length > 0 && <div className={styles.notificationBadge} />}
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
                            <button onClick={() => router.push("/dashboard/notification")}>
                                <span className={oxygen.className}>See All</span>
                            </button>
                        </div>
                    </div>
                    : null
            }

            {loading ?
                <Spinner heigth={35} width={35} /> : <div onClick={() => setToggle(() => !toggle)} className={styles.profile}>
                    <h2 className={poppins.className}>{data?.getProfileByUserId?.fullname}</h2>
                    {toggle ? <TbChevronUp size={25} /> : <TbChevronDown size={25} />}
                </div>}
            {
                toggle &&
                <div className={styles.logoutContainer}>
                    <div className={styles.profileCon}>
                        <div className={styles.prof}>
                            <div key={data.getProfileByUserId.profileID}>
                                <div className={styles.avatar}>
                                    <span className={poppins.className}>{data.getProfileByUserId.firstname[0]}{data.getProfileByUserId.lastname[0]}</span>
                                </div>
                                <h2 className={poppins.className}>{data.getProfileByUserId.fullname}</h2>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <button className={styles.settingsBtn} onClick={() => router.push("/dashboard/settings")}>
                        <TbSettings size={20} />
                        <span className={oxygen.className}>Settings</span>
                    </button>
                    <hr />
                    <button className={styles.logout} onClick={onHandleLogout}>
                        <TbLogout size={20} />
                        <span className={oxygen.className}>Logout</span>
                    </button>
                </div>

            }
        </div>
    )
}
