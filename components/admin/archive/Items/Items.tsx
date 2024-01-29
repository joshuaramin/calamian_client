import React, { useEffect } from 'react'
import { Poppins } from 'next/font/google'
import { useQuery } from '@apollo/client'
import { GetAllArchive } from '@/lib/util/archive/archive.query'
import { ArchiveSubscriptions } from '@/lib/util/archive/archive.subscriptions'
import ItemQuery from './itemQuery'
import styles from './items.module.scss'


const ItemsArchiveTab = [ "Name", "Dosage", "Price", "Expired Date", "Archive Date", "Action" ]

const poppins = Poppins({
    weight: "500",
    subsets: [ "latin" ]
})
export default function ItemsArchive({ userIds }: any) {


    const { loading, data, subscribeToMore } = useQuery(GetAllArchive, {
        variables: {
            tab: "item"
        }
    })
    useEffect(() => {
        return subscribeToMore({
            document: ArchiveSubscriptions,
            variables: {
                tab: "item",
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
                            <td></td>
                            <td></td>
                        </tr> : data.getAllArchiveByTab.map(({ archiveID, createdAt, items }: { archiveID: string, createdAt: any, items: [] }) => (
                            items.map(({ items, dosage, itemsID, storeInfo }: { items: string, dosage: string, itemsID: string, storeInfo: [] }) => (
                                storeInfo.map(({ price, expiredDate }: { price: number, expiredDate: any }) => (
                                    <ItemQuery key={itemsID} items={items} dosage={dosage} archiveID={archiveID} price={price} expiredDate={expiredDate} date={createdAt} userIds={userIds} />
                                ))
                            ))
                        ))}
                </tbody>
            </table>
        </div>
    )
}
