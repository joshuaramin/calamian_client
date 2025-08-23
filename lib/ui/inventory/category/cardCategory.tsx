import React, { useState } from 'react'
import { TbDotsVertical, TbFolder } from 'react-icons/tb'
import styles from '@/styles/dashboard/inventory/inventory.module.scss'
import { useRouter } from 'next/router'
import CentralPrompt from '@/components/prompt'
import { InputText } from '@/components/input'
import { SubmitHandler, useForm } from 'react-hook-form'
import { CategorySchema } from '@/lib/validation/CategorySchema'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@apollo/client'
import { UpdateCategory, DeleteCategory } from '@/lib/apollo/category/category.mutation'
import { poppins } from '@/lib/typography'


type Category = {
    categoryID: string
    category: string
    userID: string
}


type CategoriesFormValues = z.infer<typeof CategorySchema>

export default function CardCategory({ categoryID, category, userID }: Category) {

    const [optionsBtn, setOptionsBtn] = useState(false)
    const [renameBtn, setRenameBtn] = useState(false)
    const [deleteBtn, setDeleteBtn] = useState(false)



    const { register, formState: { errors }, handleSubmit } = useForm<CategoriesFormValues>({
        resolver: zodResolver(CategorySchema),
        defaultValues: {
            category: category
        }
    })


    const [editMutate] = useMutation(UpdateCategory)
    const [deleteMutate] = useMutation(DeleteCategory,
        {
            variables: { categoryId: categoryID, userId: userID }, onCompleted: () => {
                router.reload()
            }
        }
    )

    const onHandleDelete = () => { deleteMutate() }

    const onHandleSubmit: SubmitHandler<CategoriesFormValues> = (data) => {
        editMutate({
            variables: {
                categoryId: categoryID,
                category: data.category,
                userId: userID
            },
            onCompleted: () => {

            },
            errorPolicy: "all",
        })
    }

    const onCancelHandle = () => {
        setRenameBtn(false)
    }

    const onCancelDeleteHandle = () => {
        setDeleteBtn(false)
    }

    const router = useRouter()
    return (
        <div className={styles.categoryCard} key={categoryID}>
            {
                renameBtn && <CentralPrompt
                    footer={true}

                    body={<>
                        <InputText
                            register={register}
                            error={errors.category}
                            icon={false}
                            isRequired={true}
                            label='Category name'
                            name='category'
                            type='text'
                        />
                    </>}
                    buttoName='Yes, Change it' title={'Update Category Name'}
                    headerClose={false}
                    submitHandler={handleSubmit(onHandleSubmit)}
                    onClose={onCancelHandle} />
            }
            {
                deleteBtn && <CentralPrompt title={'Delete Category'}
                    headerClose={false}
                    buttoName='Yes, Confirm'
                    body={<>
                        <span style={{ fontSize: "15px" }} className={poppins.className}>
                            Are you sure you want to delete this item? Deleting it will permanently remove all associated data, and once deleted, it cannot be recovered. Please confirm if you wish to proceed with this action
                        </span>
                    </>}
                    submitHandler={onHandleDelete}
                    onClose={onCancelDeleteHandle}
                    footer={true}

                />
            }
            <div onClick={() => router.push(`${router.pathname}/${categoryID}`)} className={styles.card}>
                <TbFolder size={25} />
                <span className={poppins.className}>{category}</span>
            </div>
            <div className={styles.btnGrp}>
                <button onClick={() => setOptionsBtn(() => !optionsBtn)} className={styles.btnVertical}>
                    <TbDotsVertical />
                </button>
                {optionsBtn && <div className={styles.options}>
                    <button onClick={() => {
                        setRenameBtn(() => !renameBtn)
                        if (optionsBtn === true) {
                            setOptionsBtn(false)
                        }
                    }}>Rename</button>
                    <button onClick={() => {
                        setDeleteBtn(() => !deleteBtn)
                        if (optionsBtn === true) {
                            setOptionsBtn(false)
                        }
                    }}>Delete</button>
                </div>}
            </div>
        </div>
    )
}
