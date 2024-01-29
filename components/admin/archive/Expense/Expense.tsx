import React, { useEffect } from 'react'
import { Poppins } from 'next/font/google'
import { GetAllArchive } from '@/lib/util/archive/archive.query'
import { ArchiveSubscriptions } from '@/lib/util/archive/archive.subscriptions'
import { useQuery } from '@apollo/client'
import ExpenseQuery from './expenseQuery'
import styles from './expense.module.scss'

const ItemsArchiveTab = [ "Name", "Amount", "Acrhive Date", "Actions" ]

const poppins = Poppins({
    weight: "500",
    subsets: [ "latin" ]
})

export default function ExpenseArchive({ userIds }: any) {

    const { loading, data, subscribeToMore } = useQuery(GetAllArchive, {
        variables: {
            tab: "expFolder"
        }
    })
    useEffect(() => {
        return subscribeToMore({
            document: ArchiveSubscriptions,
            variables: {
                tab: "expFolder",
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
                        {ItemsArchiveTab.map((name) => (
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
                        </tr> : data.getAllArchiveByTab.map(({ archiveID, createdAt, expenseFolder }: { archiveID: string, createdAt: any, expenseFolder: [] }) => (
                            expenseFolder.map(({ expFolderID, exFolder, expenseAmount }: { expFolderID: string, exFolder: string, createdAt: any, expenseAmount: number }) => (
                                <ExpenseQuery key={archiveID} archiveID={archiveID} name={exFolder} date={createdAt} amount={expenseAmount} userIds={userIds} />
                            ))
                        ))}
                </tbody>
            </table>
        </div>
    )
}
