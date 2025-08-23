import React, { SyntheticEvent, useState } from 'react'


import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'

import { format } from 'date-fns'
import { TbEdit, TbTrash } from 'react-icons/tb'
import styles from '@/styles/dashboard/inventory/category.module.scss'
import { oxygen, poppins } from '@/lib/typography'
import { ItemSchema } from '@/lib/validation/ItemSchema'
import { InputText } from '@/components/input'
import CentralPrompt from '@/components/prompt'
import { useMutation } from '@apollo/client'
import { DeleteMedicalItem, UpdateMedicalItem } from '@/lib/apollo/Items/item.mutation'
import { getItemByCategoryid } from '@/lib/apollo/Items/item.query'
import store from 'store2'
import { useRouter } from 'next/router'


type ItemFormValue = z.infer<typeof ItemSchema>


export default function ItemTr({ itemsID, items, quantity, dosage, expiredDate, price, categoryID, userId }: any) {

    const router = useRouter();
    const [UpdateMutate] = useMutation(UpdateMedicalItem)
    const [DeleteMutation] = useMutation(DeleteMedicalItem)

    const [ed, setEdit] = useState(false)
    const [del, setDelete] = useState(false)


    const { register, formState: { errors }, handleSubmit } = useForm<ItemFormValue>({
        resolver: zodResolver(ItemSchema),
        defaultValues: {
            categoryID: categoryID,
            dosage: dosage,
            expiredDate: expiredDate,
            item: items,
            price: price,
            quantity: quantity
        }
    })



    const onHandleEditMutation: SubmitHandler<ItemFormValue> = (data) => {

        UpdateMutate({
            variables: {
                itemsId: itemsID,
                userId: userId,
                items: {
                    items: data.item,
                    price: data.price,
                    quantity: data.quantity,
                    expiredDate: data.expiredDate,
                    dosage: data.dosage
                }
            },
            onCompleted: () => {
                alert("Hello world")
            },
            refetchQueries: [{
                query: getItemByCategoryid,
                variables: {
                    categoryId: categoryID
                }
            }]
        })
    }

    const onHandleDeleteMutation = (e: SyntheticEvent) => {

        DeleteMutation({
            variables: {
                itemsId: itemsID,
                userId: userId,
            },
            onCompleted: () => {
                router.reload()
            }
        })
    }


    const onHandleCloseDeleteItem = () => {
        setDelete(() => !del)
    }

    const onHandleCloseEditItem = () => {
        setEdit(() => !ed)
    }

    return (
        <tr key={itemsID}>
            <td className={oxygen.className}>{items}</td>
            <td className={oxygen.className}>{Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(price)}</td>
            <td className={oxygen.className}>x{quantity}</td>
            <td className={oxygen.className}>{dosage === null ? "N/A" : dosage}</td>
            <td className={oxygen.className}>{expiredDate === null ? "N/A" : format(new Date(expiredDate), "MMMM dd, yyyy")}</td>
            <td className={styles.actionsBtn}>
                <button className={styles.actBtn} onClick={onHandleCloseEditItem}>
                    <TbEdit size={23} />
                </button>
                <button className={styles.actBtn} onClick={onHandleCloseDeleteItem}>
                    <TbTrash size={23} />
                </button>
                {
                    del && <CentralPrompt
                        title={'Delete Item'}
                        buttoName='Yes, Confirm'
                        body={
                            <>
                                <span style={{ fontSize: "15px" }} className={poppins.className}>
                                    Are you sure you want to delete this item? Deleting it will permanently remove all associated data, and once deleted, it cannot be recovered. Please confirm if you wish to proceed with this action
                                </span></>
                        }
                        headerClose={false}
                        submitHandler={onHandleDeleteMutation}
                        onClose={onHandleCloseDeleteItem}
                        footer={true}

                    />
                }
                {
                    ed &&

                    <CentralPrompt title={'Update Item'}
                        headerClose={false}
                        onClose={onHandleCloseEditItem}
                        footer={true}
                        submitHandler={handleSubmit(onHandleEditMutation)}
                        buttoName='Save'
                        body={<>
                            <InputText
                                icon={false}
                                isRequired={true}
                                label='Item Name'
                                name='item'
                                type='text'
                                register={register}
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
                            <InputText
                                icon={false}
                                isRequired={false}
                                label='Expired Date'
                                name='expiredDate'
                                type='date'
                                register={register}
                                error={errors.expiredDate}
                            />


                            <InputText
                                icon={false}
                                isRequired={false}
                                label='Dosage'
                                name='dosage'
                                type='text'
                                register={register}
                                error={errors.dosage}
                            />


                        </>}
                    />
                }
            </td>
        </tr>
    )
}
