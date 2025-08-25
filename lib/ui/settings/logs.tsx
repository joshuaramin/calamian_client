import React, { useEffect, useState } from 'react'
import styles from './logs.module.scss'
import { UsersActivityLogs } from '@/lib/apollo/User/logs/logs.query'
import { useQuery } from '@apollo/client'
import { format } from 'date-fns'
import { TbChevronLeft, TbChevronRight } from 'react-icons/tb'
import { oxygen, poppins } from '@/lib/typography'
import store from 'store2'

const orders = [
    { name: "Newest", value: "desc" },
    { name: "Oldest", value: "asc" }
]

export default function ActivityLogs() {


    const [userID, setUserID] = useState("")

    useEffect(() => {
        const user = store.get("UserAccount")
        setUserID(user.user_id)
    }, [userID])

    const [order, setOrders] = useState("desc")
    const [pages, setPages] = useState(0)
    const [orderOpen, setOrderOpen] = useState(false)
    const { loading, data } = useQuery(UsersActivityLogs, {
        variables: {
            userId: userID,
            orders: order,
            take: 10,
            offset: pages * 10
        }
    })


    if (loading) return <></>

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button onClick={() => setOrderOpen(() => !orderOpen)} className={styles.sort}>
                    <span className={poppins.className}>{order == "desc" ? "Newest" : "Oldest"}</span>
                </button>
                {orderOpen ? <div className={styles.orders}>
                    {orders.map(({ name, value }) => (
                        <button className={poppins.className} type="button" key={name} value={value} onClick={(e) => {
                            setOrders(e.currentTarget.value)
                            setOrderOpen(false)
                        }}>{name}</button>
                    ))}

                </div> : null}
            </div>
            <div className={styles.logsContanier}>
                {data.getLogByUserId.map(({ logsID, logs, descriptions, createdAt }: { logsID: string, logs: string, descriptions: string, createdAt: any }) => (
                    <div className={styles.card} key={logsID}>
                        <div className={styles.cardHeader}>
                            <h2 className={poppins.className}>{logs}</h2>
                            <span className={oxygen.className}>{format(new Date(createdAt), "MMMM dd, yyyy")}</span>
                        </div>
                        <p className={oxygen.className}>{descriptions}</p>
                    </div>
                ))}
            </div>
            <div className={styles.grpbtn}>
                <button disabled={pages === 0} onClick={() => setPages(() => pages - 1)}>
                    <TbChevronLeft size={18} />
                    <span>Prev</span>
                </button>
                <button disabled={data.getLogByUserId.length < 10} onClick={() => setPages(() => pages + 1)}>
                    <span>Next</span>
                    <TbChevronRight size={18} />
                </button>
            </div>
        </div>
    )
}
