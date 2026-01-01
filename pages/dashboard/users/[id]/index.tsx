"use client"

import Dashboard from '@/layout/dashboard.layout'
import PageWithLayout from '@/layout/page.layout'
import { client } from '@/lib/apollo/apolloWrapper'
import { GetUserByid, getAllUserQuery } from '@/lib/apollo/User/user.query'
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next'
import React, { FC } from 'react'
import styles from '@/styles/dashboard/users/id.module.scss'
import { oxygen, poppins, rubik } from '@/lib/typography'
import Image from 'next/image'
import { format } from 'date-fns'

/** User profile interface */
interface UserProfile {
    fullname: string
    birthday: string
    phone: string
}

/** User interface */
interface User {
    userID: string
    role: string
    salary: { salary: number }
    myProfile: UserProfile
}

/** GraphQL query response interfaces */
interface GetAllUserAccountResponse {
    getAllUserAccount: User[]
}

interface GetUserByIdResponse {
    getUserById: User
}

interface Props {
    user: User | null
}

// -------------------- STATIC PATHS --------------------
export const getStaticPaths: GetStaticPaths = async () => {
    const { data } = await client.query<GetAllUserAccountResponse>({
        query: getAllUserQuery
    })

    const paths = data?.getAllUserAccount.map(user => ({
        params: { id: user.userID }
    })) || []

    return { paths, fallback: true }
}

// -------------------- STATIC PROPS --------------------
export const getStaticProps: GetStaticProps<Props> = async (context: GetStaticPropsContext) => {
    const userId = context.params?.id as string

    const { data } = await client.query<GetUserByIdResponse>({
        query: GetUserByid,
        variables: { userId }
    })

    return {
        props: {
            user: data?.getUserById ?? null
        },
        revalidate: 60
    }
}

// -------------------- COMPONENT --------------------
const UserDetail: FC<Props> = ({ user }) => {
    if (!user) return <div>Loading user...</div>

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.avatar}>
                    <Image
                        src="/default.jpg"
                        alt={user.myProfile.fullname}
                        fill
                        style={{ objectFit: 'cover', objectPosition: 'center' }}
                        priority
                    />
                </div>
                <div className={styles.basicInfo}>
                    <h1 className={poppins.className}>{user.myProfile.fullname}</h1>
                    <p className={oxygen.className}>{user.role.toUpperCase()}</p>
                </div>
            </div>

            <div className={styles.body}>
                <table>
                    <tbody>
                        <tr>
                            <th className={rubik.className}>Name</th>
                            <td className={oxygen.className}>{user.myProfile.fullname}</td>
                        </tr>
                        <tr>
                            <th className={rubik.className}>Birthday</th>
                            <td className={oxygen.className}>
                                {format(new Date(user.myProfile.birthday), "MMMM dd, yyyy")}
                            </td>
                        </tr>
                        <tr>
                            <th className={rubik.className}>Phone Number</th>
                            <td className={oxygen.className}>{user.myProfile.phone}</td>
                        </tr>
                        <tr>
                            <th className={rubik.className}>Salary</th>
                            <td className={oxygen.className}>
                                {Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(user.salary.salary)}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

// Layout
(UserDetail as PageWithLayout).layout = Dashboard
export default UserDetail
