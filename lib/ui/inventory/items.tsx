import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client/react'
import { getItemByCategoryid } from '@/lib/apollo/Items/item.query'
import ItemQuery from './itemQuery'
import { poppins } from '@/lib/typography'
import ToastNotification from '@/components/toastNotification'
import { useRouter } from 'next/router'

type Items = {
    itemsID: string
    items: string
    dosage: string
    storeInfo: Info[]
}

type Info = {
    price: number
    quantity: number
    expiredDate: any
}

interface Props {
    getItemsByCategoryId: Items[]
}

const heads = ["Name", "Price", "Quantity", "Dosage", "Expired Date", "Actions"]

export default function Items({ categoryID, search, userId }: any) {

    const router = useRouter()

    const { loading, data } = useQuery<Props>(getItemByCategoryid,
        { variables: { categoryId: router.query.id, search: search } })

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
                    {loading ? (
                        <tr>
                            <td colSpan={6} className={poppins.className}>
                                Loading...
                            </td>
                        </tr>
                    ) : !data?.getItemsByCategoryId || data.getItemsByCategoryId.length === 0 ? (
                        <tr>
                            <td colSpan={6} className={poppins.className}>
                                No data
                            </td>
                        </tr>
                    ) : (
                        data.getItemsByCategoryId.map(({ itemsID, items, dosage, storeInfo }, itemIndex) =>
                            storeInfo.map(({ price, quantity, expiredDate }: any, infoIndex: any) => (
                                <ItemQuery
                                    key={`${itemsID}-${infoIndex}`} // unique key
                                    itemsID={itemsID}
                                    items={items}
                                    dosage={dosage}
                                    price={price}
                                    quantity={quantity}
                                    expiredDate={expiredDate}
                                    categoryID={categoryID}
                                    userId={userId}
                                />
                            ))
                        )
                    )}
                </tbody>
            </table>
            <ToastNotification />
        </div>
    )
}
