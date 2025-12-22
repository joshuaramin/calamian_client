import Dashboard from '@/layout/dashboard.layout'
import PageWithLayout from '@/layout/page.layout'
import React, { FC, useEffect, useState } from 'react'
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
import { useMutation, useQuery } from '@apollo/client/react'
import { getAllUserQuery } from '@/lib/apollo/User/user.query'
import ToastNotification from '@/components/toastNotification'
import toast from 'react-hot-toast'
import useSearch from '@/lib/hooks/useSearch'
import useToggle from '@/lib/hooks/useToggle'
import { TbChevronDown, TbChevronUp } from 'react-icons/tb'
import { format } from 'date-fns'
import { useRouter } from 'next/router'


type UserFormValues = z.infer<typeof UserCreation>

const UserThead = ["Name", "Email Address", "Role", "Contact No.", "Salary", "Actions"]

const userRoles = [
    { name: "Administator", value: "admin" },
    { name: "Manager", value: "manager" },
    { name: "Staff", value: "staff" }
]


const Users: FC = () => {

    const search = useSearch()
    const toggle = useToggle()
    const router = useRouter()

    const [role, setRoles] = useState<boolean>(false)

    const { loading, data } = useQuery(getAllUserQuery, {
        variables: {
            search: search.search
        }
    })


    const { register, handleSubmit, formState: { errors }, reset, watch, setValue } =
        useForm<UserFormValues>({
            resolver: zodResolver(UserCreation),
            defaultValues: {
                birthday: undefined, // ✅ correct
                email: "",
                firstname: "",
                lastname: "",
                phone: "",
                role: "manager",
                salary: 0,
            },
        });

    const [mutate] = useMutation(CreateUser)

    const onHandleSubmit: SubmitHandler<UserFormValues> = (data) => {
        mutate({
            variables: {
                input: {
                    birthday: format(data.birthday, "yyyy-MM-dd"), // ✅ Date
                    email: data.email,
                    firstname: data.firstname,
                    lastname: data.lastname,
                    phone: data.phone,
                    role: data.role,
                    salary: data.salary,
                },
            },
            onCompleted: () => {
                toast.success("User created successfully")
                router.reload()
            }
        });
    };

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
                        <div className={styles.selection}>
                            <div onClick={() => setRoles(() => !role)} className={styles.select}>
                                <span className={oxygen.className}>Select Role: {watch("role")} </span>
                                {role ? <TbChevronUp /> : <TbChevronDown />}
                            </div>
                            {role ? <div className={styles.options}>
                                {userRoles.map(({ name, value }) => (
                                    <button onClick={(e) => {
                                        setValue("role", value)
                                        setRoles(false)
                                    }} className={value === watch("role") ? `${styles.active}` : `${styles.notactive}`} type="button" key={name} value={value}>{name}</button>
                                ))}
                            </div> : null}
                        </div>
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
