import React, { useState, useEffect } from 'react'
import styles from '@/styles/dashboard/manager/inventory/category.module.scss'
import { useQuery } from '@apollo/client'
import { Oxygen, Poppins } from 'next/font/google'
import { getItemByCategoryid } from '@/lib/util/Items/item.query'
import { format } from 'date-fns'
import { TbArchive, TbEdit, TbTrash } from 'react-icons/tb'
import { createItemSubscriptons } from '@/lib/util/Items/items.subscriptionts'
import Delete from './archive'
import Edit from './edit'
import ItemQuery from './itemQuery'

const oxygen = Oxygen({
    weight: "400",
    subsets: [ "latin" ]
})

const poppins = Poppins({
    weight: "500",
    subsets: [ "latin" ]
})

type Items = {
    itemsID: string
    items: string
    dosage: string
    storeInfo: []
}

type Info = {
    price: number
    quantity: number
    expiredDate: any
}

const heads = [ "Name", "Price", "Quantity", "Dosage", "Expired Date", "Actions" ]

export default function Items({ categoryID, search, dataItems, userID }: any) {

    const [ ed, setEdit ] = useState(false)
    const [ del, setDelete ] = useState(false)


    const onHandleCloseDeleteItem = () => {
        setDelete(() => !del)
    }

    const onHandleCloseEditItem = () => {
        setEdit(() => !ed)
    }

    const { loading, data, subscribeToMore } = useQuery(getItemByCategoryid, { variables: { categoryId: categoryID } })


    useEffect(() => {
        return subscribeToMore({
            document: createItemSubscriptons,
            variables: {
                categoryId: categoryID
            },
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev

                const addedItems = subscriptionData.data.createItemSubscriptions

                return Object.assign({}, {
                    getItemsByCategoryId: [ prev.getItemsByCategoryId, addedItems ]
                })

            }
        })
    }, [ categoryID, subscribeToMore ])


    return (
        <div>
            <table>
                <thead>
                    <tr>
                        {heads.map((name) => (
                            <th className={poppins.className} key={name}>{name}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {search ? dataItems?.getItemBySearch.map(({ itemsID, items, dosage, storeInfo }: Items) => (
                        storeInfo.map(({ price, quantity, expiredDate }: Info) => (
                            <ItemQuery key={itemsID} itemsID={itemsID} items={items} dosage={dosage} price={price} quantity={quantity} expiredDate={expiredDate} categoryID={categoryID} userID={userID} />
                        ))
                    )) : loading ?
                        <tr>
                            <td>Loading</td>
                            <td>Loading</td>
                            <td>Loading</td>
                            <td>Loading</td>
                            <td>Loading</td>
                            <td>Loading</td>
                        </tr> : data.getItemsByCategoryId.map(({ itemsID, items, dosage, storeInfo }: Items) => (
                            storeInfo.map(({ price, quantity, expiredDate }: Info) => (
                                <ItemQuery key={itemsID} itemsID={itemsID} items={items} dosage={dosage} price={price} quantity={quantity} expiredDate={expiredDate} categoryID={categoryID} userID={userID} />
                            ))
                        ))
                    }

                </tbody>
            </table>
        </div>
    )
}
