import React from 'react'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client';
import { Poppins, Oxygen } from 'next/font/google';
import { GetAllCurrentOrdersBy20 } from '@/lib/apollo/order/order.query';
import { format } from 'date-fns';
import styles from './orderAnalytics.module.scss'

const poppins = Poppins({
    weight: "400",
    subsets: ["latin"]
})

const oxygen = Oxygen({
    weight: "400",
    subsets: ["latin"]
})


const orderTableHead = ["Orders No.", "No. of Items", "Total", "Order Created"]

export default function OrderAnalytics() {

    const router = useRouter();


    const { loading, data, error } = useQuery(GetAllCurrentOrdersBy20)

    return (
        <div className={styles.container}>
            <div className={styles.orderHeader}>
                <button onClick={() => router.push("/dashboard/admin/orders")}>See All</button>
            </div>
            <div className={styles.orderTable}>
                <table>
                    <thead>
                        <tr>
                            {orderTableHead.map((name) => (
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
                        </tr> : data.getCurrentOrdersBy20.map(({ order, itemCount, createdAt, total }: {
                            order: string, itemCount: number, createdAt: any, total: number
                        }) => (
                            <tr key={order}>
                                <td className={oxygen.className}>{order}</td>
                                <td className={oxygen.className}>{itemCount}</td>
                                <td className={oxygen.className}>{Intl.NumberFormat("en-US", { style: "currency", currency: "PHP" }).format(total)}</td>
                                <td className={oxygen.className}>{format(new Date(createdAt), "MMMM dd, yyyy")}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
