import Dashboard from '@/layout/dashboard.layout'
import PageWithLayout from '@/layout/page.layout'
import React, { FC, useEffect, useState } from 'react'
import Head from 'next/head'
import styles from '@/styles/dashboard/manager/finance/finance.module.scss'
import AddExpenseFolder from '@/components/manager/finance/add'
import { jwtDecode } from 'jwt-decode'
import FinanceQuery from '@/components/manager/finance/financeQuery'
import { GetServerSidePropsContext } from 'next'
import { TbLayoutColumns, TbLayoutList } from 'react-icons/tb'
import { useLocalStorageValue } from '@react-hookz/web'
import { useLazyQuery, useQuery } from '@apollo/client'
import { GetAllExpenseFolder, GetSearchByFolder } from '@/lib/util/finance/finance.query'
import { ExpenseFolderSubscriptions } from '@/lib/util/finance/finance.subscriptions'

const Finance: FC = ({ userID }: any) => {

    const [ addNewFolder, setAddNewFolder ] = useState(false)
    const [ search, setSearch ] = useState("")

    const onHandleAddFolder = () => {
        setAddNewFolder(() => !addNewFolder)
    }

    const { loading, data, subscribeToMore } = useQuery(GetAllExpenseFolder)
    const [ SearchFolder, { data: searchData } ] = useLazyQuery(GetSearchByFolder, {
        variables: {
            search
        }
    })
    const dataStore = useLocalStorageValue("FCROW", { initializeWithValue: false })

    const onHandleLocalStorageStore = () => {
        dataStore.set(true)
        if (dataStore.value === true) {
            dataStore.set(false)
        }
    }


    useEffect(() => {
        return subscribeToMore({
            document: ExpenseFolderSubscriptions,
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev
                const newFolderAdded = subscriptionData.data.expenseFolderSubscriptions

                return Object.assign({}, {
                    getAllExpenseFolder: [ ...prev.getAllExpenseFolder, newFolderAdded ]
                })
            }
        })
    }, [ subscribeToMore ])


    return (
        <div className={styles.container}>
            <Head>
                <title>Finance</title>
            </Head>
            {
                addNewFolder ? <div className={styles.overlay}>
                    <AddExpenseFolder close={onHandleAddFolder} userID={userID} />
                </div> : null
            }
            <div className={styles.search}>
                <div className={styles.search}>
                    <input type="search" placeholder='Find a Expense Folder' onChange={(e) => {
                        SearchFolder()
                        setSearch(e.target.value)
                    }} />
                    <button onClick={() => setAddNewFolder(() => !addNewFolder)}>New</button>
                </div >
            </div>
            <div className={styles.filter}>
                <button onClick={onHandleLocalStorageStore}>
                    {dataStore.value ? <TbLayoutList size={25} /> : <TbLayoutColumns size={25} />}
                </button>
            </div>
            <div className={dataStore.value ? `${styles.row}` : `${styles.column}`}>
                {search ? searchData?.getSearchByFolderName.map(({ expFolderID, exFolder, createdAt }: { expFolderID: string, exFolder: string, createdAt: string }) => (
                    <FinanceQuery key={expFolderID} exFolder={exFolder} date={createdAt} expFolderID={expFolderID} userID={userID} />
                )) : loading ? "" : data.getAllExpenseFolder.map(({ expFolderID, exFolder, createdAt }: { expFolderID: string, exFolder: string, createdAt: string }) => (
                    <FinanceQuery key={expFolderID} exFolder={exFolder} date={createdAt} expFolderID={expFolderID} userID={userID} />
                ))}
            </div>
        </div >
    )
}
(Finance as PageWithLayout).layout = Dashboard
export default Finance



export const getServerSideProps = async (context: GetServerSidePropsContext) => {

    const cookies = context.req.cookies[ "pha-tkn" ]

    const { userId }: any = jwtDecode(cookies as any)

    return {
        props: {
            userID: userId
        }
    }

}