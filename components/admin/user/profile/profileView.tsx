import React, { useState } from 'react'
import styles from './profileView.module.scss'
import { GetUserByid } from '@/lib/util/User/user.query'
import { useQuery } from '@apollo/client'
import { Poppins, Oxygen } from 'next/font/google'
import { TbChevronLeft, TbChevronRight, TbX } from 'react-icons/tb'
import { format } from 'date-fns'
import { UsersActivityLogs } from '@/lib/util/User/logs/logs.query'

const poppins = Poppins({
    weight: "500",
    subsets: [ "latin" ]
})


const oxygen = Oxygen({
    weight: "400",
    subsets: [ "latin" ]
})
export default function ProfileView({ userID, close }: { userID: string, close: () => void }) {

    const { loading, data } = useQuery(GetUserByid, {
        variables: {
            userId: userID
        }
    })

    const [ pages, setPages ] = useState(0)
    const { loading: loadingLogs, data: logsData } = useQuery(UsersActivityLogs, {
        variables: {
            userId: userID,
            orders: "desc",
            take: 10,
            offset: pages * 10
        }
    })

    return (
        <div className={styles.container}>
            <div className={styles.ph}>
                <button onClick={close}>
                    <TbX size={23} />
                </button>
            </div>
            <div>
                {loading ? "" : data.getUserById.map(({ userID, email, role, myProfile, logs, salary }: { userID: string, email: string, role: string, myProfile: [], logs: [], salary: [] }) => (
                    <div key={userID} className={styles.profile}>
                        {myProfile.map(({ profileID, phone, fullname, birthday }: any) => (
                            <div key={profileID} className={styles.prof}>
                                <div className={styles.header}>
                                    <h2 className={poppins.className}>{fullname}</h2>
                                </div>
                                <div className={styles.cons}>
                                    <span>Email: {email}</span>
                                    <span>Role: {role.toUpperCase()}</span>
                                    <span>Phone: {phone.replaceAll("+63", "0")}</span>
                                    <span>Birthday: {format(new Date(birthday), "MMMM dd, yyyy")}</span>
                                    <span>Salary:
                                        {salary.map(({ salary }) => (
                                            <span key={salary}> {Intl.NumberFormat("en-US", { style: "currency", currency: "PHP" }).format(salary)}</span>
                                        ))}
                                    </span>
                                </div>
                            </div>
                        ))}
                        <div className={styles.logs}>
                            <div className={styles.header}>
                                <h2 className={poppins.className}>User Activity</h2>
                            </div>
                            <div className={styles.logsContainer}>
                                {loadingLogs ? "Loading" : logsData.getLogByUserId.map(({ logsID, createdAt, descriptions, logs }: { logsID: string, createdAt: any, descriptions: string, logs: string }) => (
                                    <div className={styles.card} key={logsID}>
                                        <div className={styles.cardHeader}>
                                            <h2 className={poppins.className}>{logs}</h2>

                                        </div>
                                        <p className={oxygen.className}>{descriptions}</p>
                                        <span className={oxygen.className}>{format(new Date(createdAt), "MMMM dd, yyyy")}</span>
                                    </div>
                                ))}

                            </div>
                            <div className={styles.grpbtn}>
                                <button disabled={pages === 0} onClick={() => setPages(() => pages - 1)}>
                                    <TbChevronLeft size={18} />
                                    <span>Prev</span>
                                </button>
                                <button disabled={loadingLogs ? true : logsData.getLogByUserId.length < 10} onClick={() => setPages(() => pages + 1)}>
                                    <span>Next</span>
                                    <TbChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
