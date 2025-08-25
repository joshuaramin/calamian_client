"use client"

import React, { useState } from 'react'
import { TbEdit, TbKey, TbTrash, TbEye } from 'react-icons/tb'
import z from 'zod'
import styles from '@/styles/dashboard/users/user.module.scss'
import { oxygen } from '@/lib/typography'
import { useRouter } from 'next/router'
import CentralPrompt from '@/components/prompt'
import { InputText } from '@/components/input'
import { SubmitHandler, useForm } from 'react-hook-form'
import { UserCreation } from '@/lib/validation/UserSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@apollo/client'
import { ResetDefaultPassword, UpdateUserAccounts, DeleteUser as DeleteUserAccount } from '@/lib/apollo/User/user.mutation'
import { getAllUserQuery } from '@/lib/apollo/User/user.query'



type UserFormValues = z.infer<typeof UserCreation>



export default function UsersQuery({ userID, email, role, salary, fullname, phone, firstname, lastname, birthday, mUser }: any) {

    const router = useRouter()

    const [edit, setEdituser] = useState(false)
    const [onReset, setReset] = useState(false)
    const [uDelete, setUDelete] = useState(false)

    const onHandleEditClose = () => {
        setEdituser(() => !edit)
    }
    const onHandleResetPasswordClose = () => {
        setReset(() => !onReset)
    }
    const onHandleDeleteCLose = () => {
        setUDelete(() => !uDelete)
    }

    const [resetMutate] = useMutation(ResetDefaultPassword)
    const [editMutate] = useMutation(UpdateUserAccounts)
    const [deleteMutate] = useMutation(DeleteUserAccount)

    const { register, handleSubmit, reset, formState: { errors } } = useForm<UserFormValues>({
        resolver: zodResolver(UserCreation),
        defaultValues: {
            birthday: birthday,
            email: email,
            firstname: firstname,
            lastname: lastname,
            phone: phone,
            salary: salary,
            role: role
        }
    })

    console.log("Edit Profile", errors)
    const onHandleResetPassword = () => {
        resetMutate({
            variables: {
                userId: userID
            },
            onCompleted: () => {
                router.reload()
            }
        })
    }

    const onHandleDeleteUser = () => {
        deleteMutate({
            variables: {
                userId: userID,
                main: mUser
            },
            onCompleted: () => {

            },
            refetchQueries: [getAllUserQuery]
        })
    }


    const onHandleEditSubmit: SubmitHandler<UserFormValues> = (data) => {

        editMutate({
            variables: {
                userId: userID,
                user: {
                    birthday: data.birthday,
                    email: data.email,
                    firstname: data.firstname,
                    lastname: data.lastname,
                    phone: data.phone,
                    salary: data.salary
                }
            },
            onCompleted: () => {
            },
            refetchQueries: [getAllUserQuery]
        })

    }
    return (
        <tr key={userID}>

            <td className={oxygen.className}>{fullname}</td>
            <td className={oxygen.className}>{email.length <= 60 ? `${email.substring(0, 20)}...` : `${email}`}</td>
            <td style={{ textTransform: "uppercase" }} className={oxygen.className}>{role}</td>
            <td className={oxygen.className}>{phone.replaceAll("+63", "0")}</td>

            <td className={oxygen.className}>{Intl.NumberFormat("en-PH", { currency: "PHP", style: "currency" }).format(salary)}</td>
            <td className={oxygen.className}>
                {
                    onReset &&

                    <CentralPrompt title={'Reset Password'}
                        buttoName='Yes, Reset Password'
                        headerClose={false}
                        submitHandler={onHandleResetPassword}
                        onClose={onHandleResetPasswordClose}
                        footer={true}
                        body={
                            <span style={{ textAlign: "left" }} className={oxygen.className}>Resetting a user password to default, with the default password being the user{"'"}s birthday in <b>{"'"}YYYYMMDD{"'"}</b> format, provides a convenient and secure method for users to regain access to their accounts when they have forgotten their passwords. This approach combines user-friendliness with security, allowing individuals to easily reset their passwords by entering a personal and memorable date. The format <b>{"'"}YYYYMMDD{"'"}</b> ensures consistency and accuracy, enhancing the overall user experience.</span>
                        }
                    />
                }
                {
                    uDelete && <CentralPrompt title={'Delete User Account'}
                        headerClose={false}
                        submitHandler={onHandleDeleteUser}
                        onClose={onHandleDeleteCLose}
                        footer={true}
                        buttoName='Yes, Delete this user'
                        body={<>
                            <span className={oxygen.className}>
                                Are you sure you want to delete this user? Deleting it will permanently remove all associated data, and once deleted, it cannot be recovered. Please confirm if you wish to proceed with this action
                            </span>
                        </>}
                    />

                }

                {
                    edit &&
                    <CentralPrompt title={'Edit User Profile'}
                        headerClose={false}
                        submitHandler={handleSubmit(onHandleEditSubmit)} onClose={onHandleEditClose} footer={true}
                        buttoName='Save'
                        body={
                            <>

                                <InputText
                                    icon={false}
                                    isRequired={true}
                                    label='Email'
                                    name='email'
                                    register={register}
                                    type='text'
                                    error={errors.email}
                                />
                                <InputText
                                    icon={false}
                                    isRequired={true}
                                    label='First Name'
                                    name='firstname'
                                    register={register}
                                    type='text'
                                    error={errors.email}
                                />
                                <InputText
                                    icon={false}
                                    isRequired={true}
                                    label='Last Name'
                                    name='lastname'
                                    register={register}
                                    type='text'
                                    error={errors.lastname}
                                />
                                <InputText
                                    icon={false}
                                    isRequired={true}
                                    label='Birthday'
                                    name='birthday'
                                    register={register}
                                    type='date'
                                    error={errors.birthday}
                                />
                                <InputText
                                    icon={false}
                                    isRequired={true}
                                    label='Phone'
                                    name='phone'
                                    register={register}
                                    type='text'
                                    error={errors.phone}
                                    placeholder='start at +63 (e.g. +639499...)'
                                />
                                <InputText
                                    icon={false}
                                    isRequired={true}
                                    label='Salary'
                                    name='salary'
                                    register={register}
                                    type='number'
                                    error={errors.salary}
                                />

                            </>
                        }
                    />
                }
                <button className={styles.resetPass} onClick={onHandleResetPasswordClose}>
                    <TbKey size={23} />
                </button>

                <button className={styles.editBtn} onClick={onHandleEditClose}>
                    <TbEdit size={23} />
                </button>

                <button className={styles.viewBtn} onClick={() => router.push(`/dashboard/users/${userID}`)}>
                    <TbEye size={23} />
                </button>
                <button className={styles.deleteBtn} onClick={onHandleDeleteCLose}>
                    <TbTrash size={23} />
                </button>

            </td>
        </tr>
    )
}
