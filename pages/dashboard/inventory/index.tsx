import Dashboard from '@/layout/dashboard.layout'
import PageWithLayout from '@/layout/page.layout'
import React, { FC, useState, useEffect } from 'react'
import Head from 'next/head'
import styles from '@/styles/dashboard/inventory/inventory.module.scss'
import { TbLayoutList, TbLayoutColumns } from 'react-icons/tb'
import { useLocalStorageValue } from '@react-hookz/web'
import { useMutation, useQuery } from '@apollo/client/react'
import { GetAllCategory } from '@/lib/apollo/category/category.query'
import CardCategory from '@/lib/ui/inventory/category/cardCategory'
import store from 'store2'
import CentralPrompt from '@/components/prompt'
import { InputText } from '@/components/input'
import { SubmitHandler, useForm } from 'react-hook-form'
import z from 'zod'
import { CategorySchema } from '@/lib/validation/CategorySchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { AddCategory } from '@/lib/apollo/category/category.mutation'
import toast from 'react-hot-toast'
import ToastNotification from '@/components/toastNotification'
import Spinner from '@/components/spinner'

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
            },
            onCompleted: () => {
                toast.success("Successfully Created")
                window.location.reload()
                reset({
                    category: ""
                })
            }
        })
    }

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
                {loading ? <Spinner heigth={35} width={35} /> :
                    data?.getAllCategory.map(({ categoryID, category }: Categories) => (
                        <CardCategory key={categoryID} category={category} categoryID={categoryID} userID={userID} />
                    ))}
            </div>
            <ToastNotification />
        </div >
    )
}


(Index as PageWithLayout).layout = Dashboard
export default Index
