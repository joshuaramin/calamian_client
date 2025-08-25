import Dashboard from '@/layout/dashboard.layout'
import PageWithLayout from '@/layout/page.layout'
import React, { FC, useEffect } from 'react'
import Head from 'next/head'
import styles from '@/styles/dashboard/users/user.module.scss'

import UsersQuery from '@/lib/ui/user/users'

import { oxygen, poppins } from '@/lib/typography'
import CentralPrompt from '@/components/prompt'
import { InputText } from '@/components/input'
import { SubmitHandler, useForm } from 'react-hook-form'
import z from 'zod'
import { UserCreation } from '@/lib/validation/UserSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateUser } from '@/lib/apollo/User/user.mutation'
import { useMutation, useQuery } from '@apollo/client'
import { getAllUserQuery } from '@/lib/apollo/User/user.query'
import { UserSubscriptions } from '@/lib/apollo/User/user.subscriptions'
import ToastNotification from '@/components/toastNotification'
import toast from 'react-hot-toast'
import useSearch from '@/lib/hooks/useSearch'
import useToggle from '@/lib/hooks/useToggle'


type UserFormValues = z.infer<typeof UserCreation>

const UserThead = ["Name", "Email Address", "Role", "Contact No.", "Salary", "Actions"]

const Users: FC = () => {

    const search = useSearch()
    const toggle = useToggle()

    const { loading, data, subscribeToMore } = useQuery(getAllUserQuery, {
        variables: {
            search: search.search
        }
    })


    const { register, handleSubmit, formState: { errors }, reset } = useForm<UserFormValues>({
        resolver: zodResolver(UserCreation),
        defaultValues: {
            birthday: "",
            email: "",
            firstname: "",
            lastname: "",
            phone: "",
            role: "admin",
            salary: 1000

        }
    })

    const [mutate] = useMutation(CreateUser)

    const onHandleSubmit: SubmitHandler<UserFormValues> = (data) => {
        mutate({
            variables: {
                input: {
                    birthday: data.birthday,
                    email: data.email,
                    firstname: data.firstname,
                    lastname: data.lastname,
                    phone: data.phone,
                    role: data.role,
                    salary: data.salary
                }

            },
            onCompleted: () => {
                toast.success("Successfully Created")
            }
        })
    }

    useEffect(() => {
        return subscribeToMore(({
            document: UserSubscriptions,
            updateQuery: (prev: { getAllUserAccount: any }, { subscriptionData }: any) => {
                if (!subscriptionData.data) return prev

                const userAdded = subscriptionData.data.createUserSubscriptions

                return Object.assign({}, {
                    getAllUserAccount: [prev.getAllUserAccount, userAdded]
                })
            }
        }))
    }, [subscribeToMore])
    return (
        <div className={styles.container}>
            <Head>
                <title>Users</title>
            </Head>
            {
                toggle.toggle && <CentralPrompt
                    title={'Add New User'}
                    headerClose={false}
                    body={<>
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
                            label='Birthday'
                            name='birthday'
                            register={register}
                            type='date'
                            error={errors.birthday}
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

                    </>}
                    buttoName='Add new User'
                    submitHandler={handleSubmit(onHandleSubmit)}
                    onClose={toggle.updateToggle}
                    footer={true} />
            }

            <div className={styles.addbtn}>

                <input type='search' className={oxygen.className} placeholder='Find User'
                    onChange={(e) => search.updateSearch(e.currentTarget.value)} />
                <div>
                    <button className={styles.addBtn} onClick={toggle.updateToggle}>
                        <span className={oxygen.className}>Add</span>
                    </button>
                </div>
            </div>
            <div>
                <table>
                    <thead>
                        <tr>
                            {UserThead.map((name) => (
                                <th className={poppins.className} key={name}>{name}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr> : data?.getAllUserAccount.map(({ userID, email, role, salary, createdAt, myProfile }: any) => (

                            <UsersQuery key={userID} userID={userID} email={email} role={role} salary={salary.salary} createdAt={createdAt} fullname={myProfile.fullname} phone={myProfile.phone} firstname={myProfile.firstname} lastname={myProfile.lastname} birthday={myProfile.birthday} />

                        ))}
                    </tbody>
                </table>
            </div>
            <ToastNotification />
        </div>
    )
}

(Users as PageWithLayout).layout = Dashboard
export default Users
