import React from 'react'
import styles from './profileView.module.scss'
import { GetUserByid } from '@/lib/util/User/user.query'
import { useQuery } from '@apollo/client'
import { Poppins } from 'next/font/google'
import { TbX } from 'react-icons/tb'
import { format } from 'date-fns'


const poppins = Poppins({
    weight: "500",
    subsets: [ "latin" ]
})

export default function ProfileView({ userID, close }: { userID: string, close: () => void }) {

    const { loading, data } = useQuery(GetUserByid, {
        variables: {
            userId: userID
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
                    </div>
                ))}
            </div>
        </div>
    )
}
