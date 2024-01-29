import React, { useEffect } from 'react'
import { Poppins } from 'next/font/google'
import { GetAllArchive } from '@/lib/util/archive/archive.query'
import { ArchiveSubscriptions } from '@/lib/util/archive/archive.subscriptions'
import { useQuery } from '@apollo/client'
import CategoriesQuery from './categoriesQuery'
import styles from './categoies.module.scss'


const ItemsArchiveTab = [ "Name", "No. of Items", "Acrhive Date", "Actions" ]
const poppins = Poppins({
    weight: "500",
    subsets: [ "latin" ]
})




export default function CategoriesArchive({ userIds }: any) {

    const { loading, data, subscribeToMore } = useQuery(GetAllArchive, {
        variables: {
            tab: "category"
        }
    })
    useEffect(() => {
        return subscribeToMore({
            document: ArchiveSubscriptions,
            variables: {
                tab: "category",
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
                        </tr> : data.getAllArchiveByTab.map(({ archiveID, createdAt, categories }: { archiveID: string, createdAt: any, categories: [] }) => (
                            categories.map(({ categoryID, category, totalNumberOfItems }: { categoryID: string, category: string, totalNumberOfItems: number }) => (
                                <CategoriesQuery key={archiveID} archiveID={archiveID} name={category} date={createdAt} count={totalNumberOfItems} userIds={userIds} />
                            ))
                        ))}
                </tbody>

            </table>
        </div>
    )
}
