import React, { SyntheticEvent, useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { UpdateExpense } from '@/lib/apollo/finance/finance.mutation'
import { GetAllExpense } from '@/lib/apollo/finance/finance.query'
import CentralPrompt from '@/components/prompt'
import { RegisterOptions, SubmitHandler, useForm, UseFormRegisterReturn } from 'react-hook-form'
import { InputText } from '@/components/input'
import toast from 'react-hot-toast'
import z from 'zod'
import { ExpenseSchema } from '@/lib/validation/ExpenseSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Select } from '@/components/select'
import ToastNotification from '@/components/toastNotification'
import useSearch from '@/lib/hooks/useSearch'


type ExpenseFormValue = z.infer<typeof ExpenseSchema>

export default function UpdateExpensed({ expenseID, expense, amount, mod, payDate, close, expenseFolderID }: { expenseID: string, expense: string, amount: number, mod: string, payDate: any, close: () => void, expenseFolderID: string }) {

    const search = useSearch();

    const { register, handleSubmit, reset, formState: { errors }, setValue, watch } = useForm<ExpenseFormValue>({
        resolver: zodResolver(ExpenseSchema),
        defaultValues: {
            amount: amount, expense: expense, mod: "Card", payDate: payDate
        }
    })




    const [UpdateExpenses] = useMutation(UpdateExpense)


    const onHandleSubmitForm: SubmitHandler<ExpenseFormValue> = (data) => {

        UpdateExpenses({
            variables: {
                expenseId: expenseID,
                expenses: {
                    expense: data.expense,
                    mod: data.mod,
                    payDate: data.payDate,
                    amount: data.amount
                }
            },
            onCompleted: () => {
                toast.success("Expense Updated")
            },
            refetchQueries: [{
                query: GetAllExpense, variables: {
                    expFolderId: expenseFolderID
                }
            }]
        })
    }
    return (
        <>
            <CentralPrompt
                title={'Expense Update'}
                headerClose={false}
                submitHandler={handleSubmit(onHandleSubmitForm)}
                onClose={close}
                footer={true}
                buttoName='Save'
                body={
                    <>

                        <InputText
                            icon={false}
                            label={'Expense Name'}
                            name={'expense'}
                            isRequired={false}
                            error={errors.expense}
                            register={register}
                        />

                        <Select label={'Mode of Payment'} name={'mod'} isRequired={false}
                            error={errors.mod} options={["Cash", "Card", "Paypal"].map((mod, index) => {
                                return {
                                    label: mod,
                                    value: mod
                                }
                            })} setValue={setValue} value={watch("mod")} register={register} />
                        <InputText
                            icon={false}
                            label={'Amount'}
                            name={'amount'}
                            isRequired={false}
                            error={errors.amount}
                            register={register}
                        />
                        <InputText
                            icon={false}
                            label={'Expense Date'}
                            name={'payDate'}
                            isRequired={false}
                            error={errors.payDate}
                            register={register}
                            type='date'
                        />

                    </>
                }

            />

            <ToastNotification />

        </>
    )
}
