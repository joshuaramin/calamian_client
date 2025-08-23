import Dashboard from '@/layout/dashboard.layout'
import PageWithLayout from '@/layout/page.layout'
import React, { FC, useState, useEffect } from 'react'
import Head from 'next/head'
import styles from '@/styles/dashboard/users/user.module.scss'
import { useQuery } from '@apollo/client'
import { getAllUserQuery } from '@/lib/apollo/User/user.query'
import { UserSubscriptions } from '@/lib/apollo/User/user.subscriptions'
import UsersQuery from '@/lib/ui/user/users'

import { oxygen, poppins } from '@/lib/typography'
import CentralPrompt from '@/components/prompt'
import { InputText } from '@/components/input'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { CreateUserSchema } from '@/lib/validation/UserSchema'
import { zodResolver } from '@hookform/resolvers/zod'


type UserFormValues = z.infer<typeof CreateUserSchema>

const UserThead = ["Name", "Email Address", "Role", "Contact No.", "Salary", "Actions"]

const Users: FC = ({ userIds }: any) => {
    const [search, setSearch] = useState("")
    const [add, setAdduser] = useState(false)

    const { loading, data, subscribeToMore } = useQuery(getAllUserQuery, {
        variables: {
            search
        }
    })

    const onHandleUserClose = () => {
        setAdduser(() => !add)
    }

    const { register, handleSubmit, formState: { errors }, reset } = useForm<UserFormValues>({
        // resolver: zodResolver(CreateUserSchema),
        defaultValues: {
            birthday: new Date(Date.now()),
            email: "",
            firstname: "",
            lastname: "",
            phone: "",
            role: "admin",
            salary: 1000

        }
    })

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
                add && <CentralPrompt
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
                    submitHandler={function (event: React.FormEvent<HTMLFormElement>): void {
                        throw new Error('Function not implemented.')
                    }}
                    onClose={onHandleUserClose}
                    footer={true} />
            }

            <div className={styles.addbtn}>

                <input type='search' className={oxygen.className} placeholder='Find User' onChange={(e) => {
                    setSearch(e.target.value)
                }} />
                <div>
                    <button className={styles.addBtn} onClick={() => setAdduser(() => !add)}>
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
                        </tr> : data.getAllUserAccount.map(({ userID, email, role, salary, createdAt, myProfile }: any) => (

                            <UsersQuery key={userID} userID={userID} email={email} role={role} salary={salary.salary} createdAt={createdAt} fullname={myProfile.fullname} phone={myProfile.phone} firstname={myProfile.firstname} lastname={myProfile.lastname} birthday={myProfile.birthday} mUser={userIds} />

                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

(Users as PageWithLayout).layout = Dashboard
export default Users
