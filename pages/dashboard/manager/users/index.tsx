import Dashboard from '@/layout/dashboard.layout'
import PageWithLayout from '@/layout/page.layout'
import React, { FC, useState, useEffect } from 'react'
import Head from 'next/head'
import styles from '@/styles/dashboard/manager/users/user.module.scss'
import { Poppins, Oxygen } from 'next/font/google'
import { useLazyQuery, useQuery } from '@apollo/client'
import { GetAllUserByManagerRole, GetSearchByUser, getAllUserQuery } from '@/lib/util/User/user.query'
import AddUser from '@/components/manager/user/add'
import UsersQuery from '@/components/manager/user/users'
import { UserSubscriptions } from '@/lib/util/User/user.subscriptions'
import { jwtDecode } from 'jwt-decode'
import { GetServerSidePropsContext } from 'next'

const oxygen = Oxygen({
    weight: "400",
    subsets: [ "latin" ]
})
const poppins = Poppins({
    weight: "500",
    subsets: [ "latin" ]
})


const UserThead = [ "Name", "Email Address", "Role", "Contact No.", "Salary", "Actions" ]

const Users: FC = ({ userIds }: any) => {

    const { loading, data, subscribeToMore } = useQuery(GetAllUserByManagerRole)
    const [ add, setAdduser ] = useState(false)
    const [ search, setSearch ] = useState("")
    const [ searchUser, { data: searchData } ] = useLazyQuery(GetSearchByUser, {
        variables: {
            search
        }
    })
    const onHandleUserClose = () => {
        setAdduser(() => !add)
    }

    useEffect(() => {
        return subscribeToMore(({
            document: UserSubscriptions,
            updateQuery: (prev: { getAllUserAccount: any }, { subscriptionData }: any) => {
                if (!subscriptionData.data) return prev

                const userAdded = subscriptionData.data.createUserSubscriptions

                return Object.assign({}, {
                    getAllUserAccount: [ prev.getAllUserAccount, userAdded ]
                })
            }
        }))
    }, [ subscribeToMore ])
    return (
        <div className={styles.container}>
            <Head>
                <title>Users</title>
            </Head>
            <div className={styles.addbtn}>
                {
                    add ? <div className={styles.overlay}>
                        <AddUser close={onHandleUserClose} />
                    </div> : null
                }

                <input type='search' className={oxygen.className} placeholder='Find User' onChange={(e) => {
                    searchUser()
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
                        {search ? searchData?.getSearchByUser.map(({ userID, email, role, salary, createdAt, myProfile }: any) => (
                            myProfile.map(({ fullname, phone, firstname, lastname, birthday }: any) => (
                                salary.map(({ salary: salaries }: any) => (
                                    <UsersQuery key={userID} userID={userID} email={email} role={role} salary={salaries} createdAt={createdAt} fullname={fullname} phone={phone} firstname={firstname} lastname={lastname} birthday={birthday} myUserid={userIds} />
                                ))

                            ))

                        )) : loading ? <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr> : data.getAllUserAccountManagerRole.map(({ userID, email, role, salary, createdAt, myProfile }: any) => (
                            myProfile.map(({ fullname, phone, firstname, lastname, birthday }: any) => (
                                salary.map(({ salary: salaries }: any) => (
                                    <UsersQuery key={userID} userID={userID} email={email} role={role} salary={salaries} createdAt={createdAt} fullname={fullname} phone={phone} firstname={firstname} lastname={lastname} birthday={birthday} myUserid={userIds} />
                                ))

                            ))

                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

(Users as PageWithLayout).layout = Dashboard
export default Users



export const getServerSideProps = async (context: GetServerSidePropsContext) => {

    const cookies = context.req.cookies[ "pha-tkn" ]

    const { userId }: any = jwtDecode(cookies as any)


    console.log(userId)

    return {
        props: {
            userIds: userId
        }
    }

}