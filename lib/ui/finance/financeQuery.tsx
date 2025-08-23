import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { TbDotsVertical, TbFolder } from 'react-icons/tb';
import styles from '@/styles/dashboard/finance/finance.module.scss'
import CentralPrompt from '@/components/prompt';
import { InputText } from '@/components/input';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ExpenseFolderSchema } from '@/lib/validation/ExpenseFolder';
import { poppins } from '@/lib/typography';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@apollo/client';
import { DeleteExpenseFolder, UpdateExpenseFolder } from '@/lib/apollo/finance/finance.mutation';
import z from 'zod';
import { GetAllExpenseFolder } from '@/lib/apollo/finance/finance.query';
import store from 'store2';


type ExpenseFolderFormValue = z.infer<typeof ExpenseFolderSchema>


export default function FinanceQuery({ expFolderID, exFolder }: { exFolder: string, expFolderID: string }) {

    const router = useRouter();

    const [userId, setUserId] = useState("")
    const [optionsBtn, setOptionsBtn] = useState(false);
    const [renameBtn, setRenameBtn] = useState(false);
    const [deleteBtn, setDeleteBtn] = useState(false);

    const [mutate] = useMutation(UpdateExpenseFolder)
    const [DeleteMutation] = useMutation(DeleteExpenseFolder)

    useEffect(() => {
        const user = store.get("UserAccount")
        setUserId(user?.user_id)
    }, [userId])


    const onHandleRenameBtn = () => {
        setRenameBtn(false);
    }

    const onHandleDeleteBtn = () => {
        setDeleteBtn(false)
    }

    const { register, formState: { errors }, handleSubmit } = useForm<ExpenseFolderFormValue>({
        resolver: zodResolver(ExpenseFolderSchema),
        defaultValues: {
            exFolder: exFolder,
        }
    })

    const onHandleEditMutation: SubmitHandler<ExpenseFolderFormValue> = (data) => {
        mutate({
            variables: {
                expFolderId: expFolderID,
                exFolder: data.exFolder,
                userId: userId
            },
            onCompleted: () => {

            },
            refetchQueries: [GetAllExpenseFolder]
        })
    }


    const onHandleDeleteMutation = () => {
        DeleteMutation({
            variables: {
                expFolderId: expFolderID,
                userId: userId
            },
            onCompleted: () => {

            },
            onError: (error) => {
                console.log(error)
            },
            refetchQueries: [GetAllExpenseFolder]
        })

    }
    return (
        <div className={styles.categoryCard} >
            {
                renameBtn && <CentralPrompt title={'Update Expense Folder'}
                    headerClose={false}
                    submitHandler={handleSubmit(onHandleEditMutation)}
                    onClose={onHandleRenameBtn}
                    footer={true}
                    buttoName='Yes, Change it'
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
                />
            }
            {
                deleteBtn && <CentralPrompt
                    title={'Delete Expense Folder'}
                    buttoName='Yes, Confirm'
                    body={
                        <>
                            <span style={{ fontSize: "15px" }} className={poppins.className}>
                                Are you sure you want to delete this item? Deleting it will permanently remove all associated data, and once deleted, it cannot be recovered. Please confirm if you wish to proceed with this action
                            </span></>
                    }
                    headerClose={false}
                    submitHandler={onHandleDeleteMutation}
                    onClose={onHandleDeleteBtn}
                    footer={true}

                />
            }
            <div className={styles.card} onClick={() => router.push(`/dashboard/finance/${expFolderID}`)}>
                <TbFolder size={23} />
                <span className={poppins.className}>{exFolder.length >= 20 ? `${exFolder}...` : exFolder}</span>
            </div>
            <div className={styles.btnGrp}>
                <button onClick={() => setOptionsBtn(() => !optionsBtn)} className={styles.btnVertical}>
                    <TbDotsVertical />
                </button>
                {
                    optionsBtn ? <div className={styles.options}>
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
                    </div> : null
                }
            </div>
        </div>
    )
}
