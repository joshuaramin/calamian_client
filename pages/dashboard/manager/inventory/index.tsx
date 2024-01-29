import Dashboard from '@/layout/dashboard.layout'
import PageWithLayout from '@/layout/page.layout'
import React, { FC, useState, useEffect } from 'react'
import Head from 'next/head'
import styles from '@/styles/dashboard/manager/inventory/inventory.module.scss'
import { TbLayoutList, TbLayoutColumns } from 'react-icons/tb'
import { useLocalStorageValue } from '@react-hookz/web'
import { useLazyQuery, useQuery } from '@apollo/client'
import { GetAllCategory, GetSearchCategory } from '@/lib/util/category/category.query'
import CardCategory from '@/components/manager/inventory/category/cardCategory'
import AddCategory from '@/components/manager/inventory/category/addCategory'
import { CategorySubscriptions } from '@/lib/util/category/category.subscriptions'
import { jwtDecode } from 'jwt-decode'
import { GetServerSidePropsContext } from 'next'

type Categories = {
    categoryID: string
    category: string
}
const Index: FC = ({ userID }: any) => {
    const dataStore = useLocalStorageValue("CROW", { initializeWithValue: false })

    const onHandleLocalStorageStore = () => {
        dataStore.set(true)
        if (dataStore.value === true) {
            dataStore.set(false)
        }
    }

    const [ search, setSearch ] = useState("")
    const { loading, data, error, subscribeToMore } = useQuery(GetAllCategory)
    const [ searchCategory, { data: searchData } ] = useLazyQuery(GetSearchCategory, {
        variables: {
            search
        }
    })

    const [ addNewCategory, setNewCategory ] = useState(false)

    const onHandleCancelCategory = () => {
        setNewCategory(false)
    }

    useEffect(() => {
        return subscribeToMore({
            document: CategorySubscriptions,
            updateQuery: (prev: { getAllCategory: any }, { subscriptionData }: any) => {
                if (!subscriptionData.data) return prev

                const addedCategory = subscriptionData.data.categorySubscriptions
                return Object.assign({}, {
                    getAllCategory: [ ...prev.getAllCategory, addedCategory ]
                })
            }
        })
    }, [ subscribeToMore ])

    return (
        <div className={styles.container}>
            <Head>
                <title>Inventory</title>
            </Head>
            {
                addNewCategory ? <div className={styles.overlay}>
                    <AddCategory close={onHandleCancelCategory} userID={userID} />
                </div> : null
            }
            <div className={styles.search}>
                <input type="search" onChange={(e) => {
                    searchCategory()
                    setSearch(e.target.value)
                }} />
                <button onClick={() => setNewCategory(() => !addNewCategory)}>New</button>

            </div >
            <div className={styles.filter}>
                <button onClick={onHandleLocalStorageStore}>
                    {dataStore.value ? <TbLayoutList size={25} /> : <TbLayoutColumns size={25} />}
                </button>
            </div>
            <div className={dataStore.value ? `${styles.row}` : `${styles.column}`}>
                {search ? searchData?.getSearchCategory.map(({ categoryID, category }: Categories) => (
                    <CardCategory key={categoryID} category={category} categoryID={categoryID} userID={userID} />
                )) : loading ? "Loading..." : data.getAllCategory.map(({ categoryID, category }: Categories) => (
                    <CardCategory key={categoryID} category={category} categoryID={categoryID} userID={userID} />
                ))}
            </div>
        </div >
    )
}


(Index as PageWithLayout).layout = Dashboard
export default Index


export const getServerSideProps = async (context: GetServerSidePropsContext) => {

    const cookies = context.req.cookies[ "pha-tkn" ]

    const { userId }: any = jwtDecode(cookies as any)

    return {
        props: {
            userID: userId
        }
    }

}