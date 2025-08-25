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

export const getStaticPaths: GetStaticPaths = async () => {
    const { data: { getAllUserAccount } } = await client.query({
        query: getAllUserQuery,
    })

    const paths = getAllUserAccount.map(({ userID }: { userID: string }) => ({
        params: { id: userID },
    }))

    return { paths, fallback: true }
}

export const getStaticProps: GetStaticProps = async (context: GetStaticPropsContext) => {
    const userId = context.params?.id as string

    const { data: { getUserById } } = await client.query({
        query: GetUserByid,
        variables: { userId },
    })

    return {
        props: {
            user: getUserById,
        },
        revalidate: 60,
    }
}

const Index: FC<{ user: any }> = ({ user }) => {
    if (!user) return <div>Loading...</div>

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.avatar}>
                    <Image src={"/default.jpg"} alt={user.myProfile.fullname} layout='fill' objectFit='cover' objectPosition='center' />
                </div>
                <div className={styles.basicInfo}>
                    <h1 className={poppins.className}>{user.myProfile.fullname}</h1>
                    <p className={oxygen.className}>{user.role}</p>
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
                            <td className={oxygen.className}>{format(new Date(user.myProfile.birthday), "MMMM dd, yyyy")}</td>
                        </tr>
                        <tr>
                            <th className={rubik.className}>Phone Number</th>
                            <td className={oxygen.className}>{user.myProfile.phone}</td>
                        </tr>
                        <tr>
                            <th className={rubik.className}>Salary</th>
                            <td className={oxygen.className}>{Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(user.salary.salary)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}


(Index as PageWithLayout).layout = Dashboard
export default Index
