"use client"

import Dashboard from '@/layout/dashboard.layout'
import PageWithLayout from '@/layout/page.layout'
import React, { FC, useState } from 'react'
import Head from 'next/head'
import styles from '@/styles/dashboard/users/user.module.scss'

import UsersQuery from '@/lib/ui/user/users'

import { oxygen, poppins } from '@/lib/typography'
import CentralPrompt from '@/components/prompt'
import { InputText } from '@/components/input'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserCreation } from '@/lib/validation/UserSchema'
import { useMutation, useQuery } from '@apollo/client/react'
import { getAllUserQuery } from '@/lib/apollo/User/user.query'
import { CreateUser } from '@/lib/apollo/User/user.mutation'
import ToastNotification from '@/components/toastNotification'
import toast from 'react-hot-toast'
import useSearch from '@/lib/hooks/useSearch'
import useToggle from '@/lib/hooks/useToggle'
import { TbChevronDown, TbChevronUp } from 'react-icons/tb'
import { format } from 'date-fns'
import { useRouter } from 'next/router'
import { z } from 'zod'

// -------------------- TYPES --------------------
type UserFormValues = z.infer<typeof UserCreation>

interface UserProfile {
    fullname: string
    firstname: string
    lastname: string
    phone: string
    birthday: string
}

interface User {
    userID: string
    email: string
    role: "admin" | "manager" | "staff"
    salary: { salary: number }
    createdAt: string
    myProfile: UserProfile
}

interface GetAllUserQueryResponse {
    getAllUserAccount: User[]
}

// -------------------- CONSTANTS --------------------
const UserThead = ["Name", "Email Address", "Role", "Contact No.", "Salary", "Actions"]

const userRoles = [
    { name: "Administator", value: "admin" },
    { name: "Manager", value: "manager" },
    { name: "Staff", value: "staff" }
]

// -------------------- COMPONENT --------------------
const Users: FC = () => {
    const search = useSearch()
    const toggle = useToggle()
    const router = useRouter()
    const [roleDropdown, setRoleDropdown] = useState(false)

    // -------------------- APOLLO QUERY --------------------
    const { loading, data } = useQuery<GetAllUserQueryResponse>(getAllUserQuery, {
        variables: { search: search.search }
    })

    // -------------------- FORM --------------------
    const { register, handleSubmit, watch, setValue, formState: { errors }, reset } = useForm<UserFormValues>({
        resolver: zodResolver(UserCreation) as any,
        defaultValues: {
            birthday: undefined,
            email: "",
            firstname: "",
            lastname: "",
            phone: "",
            role: "manager",
            salary: 0,
        }
    })

    // -------------------- CREATE USER --------------------
    const [createUser] = useMutation(CreateUser)

    const onHandleSubmit: SubmitHandler<UserFormValues> = async (formData) => {
        try {
            await createUser({
                variables: {
                    input: {
                        ...formData,
                        birthday: format(new Date(formData.birthday!), "yyyy-MM-dd") // ensure birthday is a string
                    }
                }
            })
            toast.success("User created successfully")
            reset()
            toggle.updateToggle()
            router.reload()
        } catch (error: any) {
            toast.error(error.message || "Something went wrong")
        }
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Users</title>
            </Head>

            {/* Add New User Modal */}
            {toggle.toggle && (
                <CentralPrompt
                    title="Add New User"
                    headerClose={false}
                    submitHandler={handleSubmit(onHandleSubmit)}
                    buttoName="Add new User"
                    onClose={toggle.updateToggle}
                    footer
                    body={
                        <>
                            <InputText label="Email" name="email" register={register} type="text" error={errors.email} isRequired />
                            <InputText label="First Name" name="firstname" register={register} type="text" error={errors.firstname} isRequired />
                            <InputText label="Last Name" name="lastname" register={register} type="text" error={errors.lastname} isRequired />
                            <InputText label="Phone" name="phone" register={register} type="text" error={errors.phone} placeholder="+639..." isRequired />
                            <InputText label="Birthday" name="birthday" register={register} type="date" error={errors.birthday} isRequired />
                            <InputText label="Salary" name="salary" register={register} type="number" error={errors.salary} isRequired />

                            {/* Role selection */}
                            <div className={styles.selection}>
                                <div onClick={() => setRoleDropdown(!roleDropdown)} className={styles.select}>
                                    <span className={oxygen.className}>Select Role: {watch("role")}</span>
                                    {roleDropdown ? <TbChevronUp /> : <TbChevronDown />}
                                </div>
                                {roleDropdown && (
                                    <div className={styles.options}>
                                        {userRoles.map(({ name, value }) => (
                                            <button
                                                key={value}
                                                type="button"
                                                value={value}
                                                onClick={() => {
                                                    setValue("role", value)
                                                    setRoleDropdown(false)
                                                }}
                                                className={watch("role") === value ? styles.active : styles.notactive}
                                            >
                                                {name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    }
                />
            )}

            {/* Search & Add */}
            <div className={styles.addbtn}>
                <input
                    type="search"
                    className={oxygen.className}
                    placeholder="Find User"
                    onChange={(e) => search.updateSearch(e.currentTarget.value)}
                />
                <div>
                    <button className={styles.addBtn} onClick={toggle.updateToggle}>
                        <span className={oxygen.className}>Add</span>
                    </button>
                </div>
            </div>

            {/* Users Table */}
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
                        {loading ? (
                            <tr>
                                {Array(UserThead.length).fill(<td key={Math.random()}></td>)}
                            </tr>
                        ) : (
                            data?.getAllUserAccount.map(user => (
                                <UsersQuery
                                    key={user.userID}
                                    userID={user.userID}
                                    email={user.email}
                                    role={user.role}
                                    salary={user.salary.salary}
                                    createdAt={user.createdAt}
                                    fullname={user.myProfile.fullname}
                                    phone={user.myProfile.phone}
                                    firstname={user.myProfile.firstname}
                                    lastname={user.myProfile.lastname}
                                    birthday={user.myProfile.birthday}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <ToastNotification />
        </div>
    )
}

(Users as PageWithLayout).layout = Dashboard
export default Users
