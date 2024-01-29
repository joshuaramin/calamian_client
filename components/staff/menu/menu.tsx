import React, { useState, useEffect } from 'react'
import styles from './menu.module.scss'
import { GetAllItemQuery, getSearchItems, getSearchStaff } from '@/lib/util/Items/item.query'
import { useQuery, useLazyQuery } from '@apollo/client'
import MenuCard from './card/card'

interface Items {
    dosage: number,
    itemsID: any
    items: string
    category: []
    storeInfo: []
}

export default function Menu() {

    const { loading, data, error, startPolling, stopPolling } = useQuery(GetAllItemQuery)

    useEffect(() => {
        const intervalPolling = setInterval(() => {
            startPolling(5000)
        })

        return () => {
            clearInterval(intervalPolling)
            stopPolling()
        }
    }, [ startPolling, stopPolling ])

    const [ search, setSearch ] = useState("")




    const [ ItemsSearch, { data: searchData } ] = useLazyQuery(getSearchStaff)

    console.log(searchData)
    const onChangeSearch = (e: any) => {
        ItemsSearch({
            variables: {
                search
            }
        })
        setSearch(e.target.value)

    }

    return (
        <div className={styles.container}>

            <div className={styles.searchContainer}>
                <input type="search" onChange={onChangeSearch} placeholder='Find an Item' />
            </div>


            <div className={styles.menu}>
                {

                    search ? searchData?.getItemsByStaff.map(({ itemsID, items, category, storeInfo }: Items) => (
                        storeInfo.map(({ price, quantity }) => (
                            <MenuCard key={itemsID} itemsID={itemsID} items={items} category={category} storeInfo={storeInfo} quan={quantity} price={price} />
                        ))
                    )) :

                        loading ? "Loading..." : data.getAllStoreItems.map(({ itemsID, items, category, storeInfo }: Items) => (
                            storeInfo.map(({ price, quantity }) => (
                                <MenuCard key={itemsID} itemsID={itemsID} items={items} category={category} storeInfo={storeInfo} quan={quantity} price={price} />
                            ))
                        ))}
            </div>
        </div>
    )
}
