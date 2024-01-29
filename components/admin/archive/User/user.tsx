import React, { useEffect } from 'react'
import { GetAllArchive } from '@/lib/util/archive/archive.query'
import { useQuery } from '@apollo/client'
import { Poppins } from 'next/font/google'
import UserQueryArchive from './userQuery'
import { ArchiveSubscriptions } from '@/lib/util/archive/archive.subscriptions'
import styles from '@/components/admin/archive/User/user.module.scss'

const poppins = Poppins({
    weight: "500",
    subsets: [ "latin" ]
})

const UserTableArchive = [ "Name", "Email Address", "Role", "Contact no.", "Archive Date", "Action" ]
export default function UserArchive({ userIds }: any) {

    const { loading, data, subscribeToMore } = useQuery(GetAllArchive, {
        variables: {
            tab: "user"
        }
    })

    useEffect(() => {
        return subscribeToMore({
            document: ArchiveSubscriptions,
            variables: {
                tab: "user",
            },
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev
                const newArchive = subscriptionData.data.archiveSubscriptions
                return Object.assign({}, {
                    getAllUserArchive: [ prev.getAllUserArchive, newArchive ]
                })
            }
        })
    }, [ subscribeToMore ])
    return (
        <div className={styles.container}>
            <table>
                <thead>
                    <tr>
                        {UserTableArchive.map((name) => (
                            <th className={poppins.className} key={name}>{name}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {loading ?
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr> : data.getAllArchiveByTab.map(({ archiveID, createdAt, user }: { archiveID: string, createdAt: any, user: [] }) => (
                            user.map(({ userID, email, role, myProfile, salary }) => (
                                <UserQueryArchive key={archiveID} userID={userID} archiveID={archiveID} date={createdAt} email={email} role={role} salary={salary} myProfile={myProfile} userIds={userIds} />
                            ))
                        ))}
                </tbody>
            </table>
        </div>
    )
}
