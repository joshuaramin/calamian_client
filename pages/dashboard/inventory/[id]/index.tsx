import React, { FC, useEffect, useState } from 'react'
import PageWithLayout from '@/layout/page.layout'
import Dashboard from '@/layout/dashboard.layout'
import styles from '@/styles/dashboard/inventory/category.module.scss'
import Head from 'next/head'
import { TbArrowLeft } from 'react-icons/tb'
import { GetAllCategory, GetCategoryID, } from '@/lib/apollo/category/category.query'
import { getSearchItems } from '@/lib/apollo/Items/item.query'
import { client } from '@/lib/apollo/apolloWrapper'
import { useRouter } from 'next/router'
import { useLazyQuery, useMutation, useQuery } from '@apollo/client'
import Items from '@/lib/ui/inventory/items'
import { oxygen } from '@/lib/typography'
import store from 'store2'
import CentralPrompt from '@/components/prompt'
import { InputText } from '@/components/input'
import { ItemSchema } from '@/lib/validation/ItemSchema'
import z from 'zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { GetStaticPropsContext } from 'next'
import { ItemMutation } from '@/lib/apollo/Items/item.mutation'

export const getStaticPaths = async () => {

    const { data: { getAllCategory } } = await client.query({
        query: GetAllCategory
    })


    const paths = getAllCategory.map(({ categoryID }: any) => {
        return { params: { id: categoryID } }
    })

    return {
        paths, fallback: true,
    }
}
export const getStaticProps = async (context: GetStaticPropsContext) => {
    const categoryid = context.params?.id

    const { data: { getCategotiesById } } = await client.query({
        query: GetCategoryID,
        variables: {
            categoryId: categoryid
        },
    })
    return {
        props: {
            data: getCategotiesById,


        },
        revalidate: 1
    }
}
type Category = {
    categoryID: string
    category: string
    items: []
}

type ItemFormValue = z.infer<typeof ItemSchema>


const Index: FC = ({ data }: any) => {


    const router = useRouter()

    const [add, setAddItem] = useState(false)
    const user = store.get("UserAccount");
    const [userId, setUsersID] = useState("")
    const [search, setSearch] = useState("")
    const [message, setMessag] = useState(false)
    const [numberOfDosage, setNumberOfDosage] = useState(false)
    const [expirationDate, setExpirationDate] = useState(false)

    const [mutate] = useMutation(ItemMutation)
    const { data: InventoryData } = useQuery(getSearchItems, {
        variables: {
            categoryId: router.query.id,
            search: search
        }
    })


    useEffect(() => {
        setUsersID(user.user_id)
    }, [user?.user_id, userId])


    const onHandleToggelClose = () => {
        setAddItem(() => !add)
    }


    const { register, formState: { errors }, handleSubmit, reset } = useForm<ItemFormValue>({
        resolver: zodResolver(ItemSchema),
        defaultValues: {
            categoryID: `${router.query.id}`,
            expiredDate: "",
            dosage: "",
            item: "",
            price: 1,
            quantity: 1
        }
    })

    const onHandelDosageForm = () => {
        setNumberOfDosage(() => !numberOfDosage)
    }


    const onHandleExpirationForm = () => {
        setExpirationDate(() => !expirationDate)
    }

    const onHandleMutation: SubmitHandler<ItemFormValue> = (data) => {
        mutate({
            variables: {
                categoryId: data.categoryID,
                userId: userId,
                items: {
                    expiredDate: expirationDate ? data.expiredDate : null,
                    dosage: numberOfDosage ? data.dosage : null,
                    items: data.item,
                    price: data.price,
                    quantity: data.quantity,
                }
            },

            onCompleted: () => {
                reset({
                    expiredDate: "",
                    dosage: "",
                    item: "",
                    price: 0,
                    quantity: 0
                })
            }
        })
    }

    return (
        data.map(({ categoryID, category, items }: Category) => (
            <div className={styles.container} key={categoryID}>
                <Head>
                    <title>{category}</title>
                </Head>

                {
                    add && <CentralPrompt
                        title={'Add Item'}
                        headerClose={false}
                        onClose={onHandleToggelClose}
                        footer={true}
                        buttoName='Add'
                        submitHandler={handleSubmit(onHandleMutation)}
                        body={
                            <>
                                <InputText
                                    icon={false}
                                    isRequired={true}
                                    label='Item Name'
                                    name='item'
                                    register={register}
                                    type='text'
                                    error={errors.item}
                                />
                                <InputText
                                    icon={false}
                                    isRequired={true}
                                    label='Quantity'
                                    name='quantity'
                                    type='number'
                                    register={register}
                                    error={errors.quantity}
                                />
                                <InputText
                                    icon={false}
                                    isRequired={true}
                                    label='Price'
                                    name='price'
                                    type='number'
                                    register={register}
                                    error={errors.price}
                                />
                                {expirationDate && <div className={styles.ss}>
                                    <InputText
                                        icon={false}
                                        isRequired={true}
                                        label='Expired Date'
                                        name='expiredDate'
                                        type='date'
                                        register={register}
                                        error={errors.expiredDate}
                                    />
                                </div>}
                                {numberOfDosage && <div className={styles.ss}>

                                    <InputText
                                        icon={false}
                                        isRequired={true}
                                        label='Dosage'
                                        name='dosage'
                                        register={register}
                                        error={errors.dosage}
                                    />

                                </div>}
                                <div className={styles.check}>
                                    <div>
                                        <input type="checkbox" onChange={onHandelDosageForm} />
                                        <label className={oxygen.className}>Dosage</label>
                                    </div>
                                    <div>
                                        <input type="checkbox" onChange={onHandleExpirationForm} />
                                        <label className={oxygen.className}>Expired Date</label>
                                    </div>
                                </div>

                            </>
                        }
                    />
                }
                <div className={styles.addbtn}>
                    <button className={styles.goback} onClick={() => router.back()}>
                        <TbArrowLeft size={23} />
                        <span>Go back</span>
                    </button>
                    <input type='search' className={oxygen.className} placeholder='Find a specific item' onChange={(e) => {
                        setSearch(e.target.value)
                    }} />
                    <div>
                        <button onClick={() => setAddItem(() => !add)}>
                            <span className={oxygen.className}>Add</span>
                        </button>

                    </div>
                </div>

                <Items categoryID={categoryID} search={search} dataItems={InventoryData} userId={userId} />

            </div>
        ))
    )
}

(Index as PageWithLayout).layout = Dashboard
export default Index