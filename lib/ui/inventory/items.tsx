import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client/react'
import { getItemByCategoryid } from '@/lib/apollo/Items/item.query'

import { createItemSubscriptons } from '@/lib/apollo/Items/items.subscriptionts'
import ItemQuery from './itemQuery'
import { poppins } from '@/lib/typography'
import ToastNotification from '@/components/toastNotification'


type Items = {
    itemsID: string
    items: string
    dosage: number
    storeInfo: []
}

type Info = {
    price: number
    quantity: number
    expiredDate: any
}

const heads = ["Name", "Price", "Quantity", "Dosage", "Expired Date", "Actions"]

export default function Items({ categoryID, search, userId }: any) {



    const { loading, data, subscribeToMore } = useQuery(getItemByCategoryid,
        { variables: { categoryId: categoryID, search: search } })

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
                    {loading ?
                        "No data" : data?.getItemsByCategoryId.map(({ itemsID, items, dosage, storeInfo }: Items) => (
                            storeInfo.map(({ price, quantity, expiredDate }: Info) => (
                                <ItemQuery key={itemsID} itemsID={itemsID} items={items} dosage={dosage} price={price} quantity={quantity} expiredDate={expiredDate} categoryID={categoryID} userId={userId} />
                            ))
                        ))
                    }

                </tbody>
            </table>
            <ToastNotification />
        </div>
    )
}
