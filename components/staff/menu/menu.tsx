import React, { useState } from 'react'
import styles from './menu.module.scss'
import {
    GetAllItemQuery,
    getSearchStaff
} from '@/lib/apollo/Items/item.query'
import { useQuery, useLazyQuery } from '@apollo/client/react'
import MenuCard from './card/card'

interface StoreInfo {
    price: number
    quantity: number
}

interface Item {
    itemsID: string
    items: string
    dosage: number
    category: []
    storeInfo: []
}

interface GetAllItemsResponse {
    getAllStoreItems: Item[]
}

interface SearchItemsResponse {
    getItemsByStaff: Item[]
}

export default function Menu() {
    const [search, setSearch] = useState("")

    const {
        loading,
        data,
    } = useQuery<GetAllItemsResponse>(GetAllItemQuery, {

    })

    const [
        searchItems,
        { data: searchData, loading: searchLoading }
    ] = useLazyQuery<SearchItemsResponse>(getSearchStaff)

    const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSearch(value)

        if (value.trim()) {
            searchItems({
                variables: { search: value }
            })
        }
    }

    const items = search
        ? searchData?.getItemsByStaff
        : data?.getAllStoreItems

    return (
        <div className={styles.container}>
            <div className={styles.searchContainer}>
                <input
                    type="search"
                    value={search}
                    onChange={onChangeSearch}
                    placeholder="Find an Item"
                />
            </div>

            <div className={styles.menu}>
                {(loading || searchLoading) && <span>Loading...</span>}

                {items?.map(({ itemsID, items, category, storeInfo }: Item) =>
                    storeInfo.map(({ price, quantity }: { price: number, quantity: number }) => (
                        <MenuCard
                            key={`${itemsID}-${price}`}
                            itemsID={itemsID}
                            items={items}
                            category={category}
                            storeInfo={storeInfo}
                            quan={quantity}
                            price={price}
                        />
                    ))
                )}
            </div>
        </div>
    )
}
