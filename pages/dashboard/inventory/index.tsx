import Dashboard from '@/layout/dashboard.layout'
import PageWithLayout from '@/layout/page.layout'
import React, { FC, useState, useEffect } from 'react'
import Head from 'next/head'
import styles from '@/styles/dashboard/inventory/inventory.module.scss'
import { TbLayoutList, TbLayoutColumns } from 'react-icons/tb'
import { useLocalStorageValue } from '@react-hookz/web'
import { useMutation, useQuery } from '@apollo/client'
import { GetAllCategory } from '@/lib/apollo/category/category.query'
import CardCategory from '@/lib/ui/inventory/category/cardCategory'
import { CategorySubscriptions } from '@/lib/apollo/category/category.subscriptions'
import store from 'store2'
import CentralPrompt from '@/components/prompt'
import { InputText } from '@/components/input'
import { SubmitHandler, useForm } from 'react-hook-form'
import z from 'zod'
import { CategorySchema } from '@/lib/validation/CategorySchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { AddCategory } from '@/lib/apollo/category/category.mutation'

type Categories = {
    categoryID: string
    category: string
}

type CategoriesFormValues = z.infer<typeof CategorySchema>
const Index: FC = () => {

    const user = store.get("UserAccount");
    const [userID, setUserId] = useState("")

    useEffect(() => {
        setUserId(user?.user_id)
    }, [user?.user_id])
    const dataStore = useLocalStorageValue("CROW", { initializeWithValue: false })
    const onHandleLocalStorageStore = () => {
        dataStore.set(true)
        if (dataStore.value === true) {
            dataStore.set(false)
        }
    }

    const [search, setSearch] = useState("")
    const { loading, data, error, subscribeToMore } = useQuery(GetAllCategory, {
        variables: {
            search: search
        }
    })

    const [addNewCategory, setNewCategory] = useState(false)

    const onHandleCancelCategory = () => {
        setNewCategory(false)
    }

    const { register, formState: { errors }, handleSubmit, reset } = useForm<CategoriesFormValues>({
        resolver: zodResolver(CategorySchema),
        defaultValues: {
            category: ""
        }
    })


    const [mutate] = useMutation(AddCategory)

    const onHandleSubmit: SubmitHandler<CategoriesFormValues> = (data) => {
        mutate({
            variables: {
                category: data.category,
                userId: userID
            }
        })
    }

    useEffect(() => {
        return subscribeToMore({
            document: CategorySubscriptions,
            updateQuery: (prev: { getAllCategory: any }, { subscriptionData }: any) => {
                if (!subscriptionData.data) return prev

                const addedCategory = subscriptionData.data.categorySubscriptions
                return Object.assign({}, {
                    getAllCategory: [...prev.getAllCategory, addedCategory]
                })
            }
        })
    }, [subscribeToMore])

    return (
        <div className={styles.container}>
            <Head>
                <title>Inventory</title>
            </Head>
            {
                addNewCategory &&
                <CentralPrompt
                    footer={true}
                    headerClose={false}
                    onClose={onHandleCancelCategory}
                    title='Add New Category'
                    buttoName='Add'
                    submitHandler={handleSubmit(onHandleSubmit)}
                    body={
                        <>
                            <InputText
                                type='text'
                                icon={false}
                                isRequired={true}
                                label='Category'
                                name='category'
                                register={register}
                                error={errors.category}

                            />
                        </>
                    }
                />
            }
            <div className={styles.search}>
                <input type="search" onChange={(e) => {
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
                {loading ? "Loading..." : data?.getAllCategory.map(({ categoryID, category }: Categories) => (
                    <CardCategory key={categoryID} category={category} categoryID={categoryID} userID={userID} />
                ))}
            </div>
        </div >
    )
}


(Index as PageWithLayout).layout = Dashboard
export default Index
