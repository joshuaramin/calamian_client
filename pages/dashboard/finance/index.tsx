import Dashboard from '@/layout/dashboard.layout'
import PageWithLayout from '@/layout/page.layout'
import React, { FC, useEffect, useState } from 'react'
import Head from 'next/head'
import styles from '@/styles/dashboard/finance/finance.module.scss'
import FinanceQuery from '@/lib/ui/finance/financeQuery'
import { TbLayoutColumns, TbLayoutList } from 'react-icons/tb'
import { useLocalStorageValue } from '@react-hookz/web'
import { useMutation, useQuery } from '@apollo/client'
import { GetAllExpenseFolder } from '@/lib/apollo/finance/finance.query'
import { ExpenseFolderSubscriptions } from '@/lib/apollo/finance/finance.subscriptions'
import store from 'store2'
import CentralPrompt from '@/components/prompt'
import { SubmitHandler, useForm } from 'react-hook-form'
import z from 'zod'
import { ExpenseFolderSchema } from '@/lib/validation/ExpenseFolder'
import { CreateExpenseFolderMutation } from '@/lib/apollo/finance/finance.mutation'
import { zodResolver } from '@hookform/resolvers/zod'
import { InputText } from '@/components/input'
import useToggle from '@/lib/hooks/useToggle'
import useSearch from '@/lib/hooks/useSearch'
import ToastNotification from '@/components/toastNotification'
import toast from 'react-hot-toast'



type ExpenseFolderFormValue = z.infer<typeof ExpenseFolderSchema>

const Finance: FC = () => {


    const [userId, setUserId] = useState("")
    const addNewFolder = useToggle()
    const search = useSearch()


    useEffect(() => {
        const user = store.get("UserAccount")
        setUserId(user?.user_id)
    }, [userId])


    const { loading, data, subscribeToMore } = useQuery(GetAllExpenseFolder, {
        variables: {
            search: search.search
        }
    })

    const dataStore = useLocalStorageValue("FCROW", { initializeWithValue: false })

    const onHandleLocalStorageStore = () => {
        dataStore.set(true)
        if (dataStore.value === true) {
            dataStore.set(false)
        }
    }


    const { register, formState: { errors }, handleSubmit, reset } = useForm<ExpenseFolderFormValue>({
        resolver: zodResolver(ExpenseFolderSchema),
        defaultValues: {
            exFolder: "",
        }
    })

    console.log(errors)

    const [mutate] = useMutation(CreateExpenseFolderMutation)


    const onHandleSubmit: SubmitHandler<ExpenseFolderFormValue> = (data) => {
        mutate({
            variables: {
                exFolder: data.exFolder,
                userId: userId
            },
            onCompleted: () => {
                toast.success("Successfully Created")
                reset({ exFolder: "" })
            }
        })
    }

    useEffect(() => {
        return subscribeToMore({
            document: ExpenseFolderSubscriptions,
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev
                const newFolderAdded = subscriptionData.data.expenseFolderSubscriptions

                return Object.assign({}, {
                    getAllExpenseFolder: [...prev.getAllExpenseFolder, newFolderAdded]
                })
            }
        })
    }, [subscribeToMore])


    return (
        <div className={styles.container}>
            <Head>
                <title>Finance</title>
            </Head>
            {
                addNewFolder.toggle && <CentralPrompt
                    onClose={addNewFolder.updateToggle}
                    footer={true}
                    headerClose={false}
                    title='Add new Expense Folder'
                    buttoName='Submit'
                    body={
                        <>
                            <InputText
                                icon={false}
                                isRequired={true}
                                label='Expense Folder Name'
                                name='exFolder'
                                register={register}
                                type='text'
                                error={errors.exFolder}
                            />

                        </>
                    }
                    submitHandler={handleSubmit(onHandleSubmit)}
                />
            }
            <div className={styles.search}>
                <div className={styles.search}>
                    <input type="search" placeholder='Find a Expense Folder' onChange={(e) => search.updateSearch(e.currentTarget.value)} />
                    <button onClick={addNewFolder.updateToggle}>New</button>
                </div >
            </div>
            <div className={styles.filter}>
                <button onClick={onHandleLocalStorageStore}>
                    {dataStore.value ? <TbLayoutList size={25} /> : <TbLayoutColumns size={25} />}
                </button>
            </div>
            <div className={dataStore.value ? `${styles.row}` : `${styles.column}`}>
                {loading ? "Loading..." : data.getAllExpenseFolder.map(({ expFolderID, exFolder }: any) => (
                    <FinanceQuery key={expFolderID} exFolder={exFolder} expFolderID={expFolderID} />
                ))}
            </div>
            <ToastNotification />
        </div >
    )
}
(Finance as PageWithLayout).layout = Dashboard
export default Finance
