import Dashboard from '@/layout/dashboard.layout'
import PageWithLayout from '@/layout/page.layout'
import React, { FC, useEffect } from 'react'
import Head from 'next/head'
import styles from '@/styles/dashboard/manager/orders/order.module.scss'
import { GetAllOrders } from '@/lib/util/order/order.query'
import { useQuery } from '@apollo/client'
import { Poppins } from 'next/font/google'
import OrdersTable from '@/components/manager/orders/orders'
import { OrderSubscriptions } from '@/lib/util/order/order.subscriptions'


const orderTableHead = [ "Orders No.", "No. of Items", "Total", "Order Created", "Action" ]


const poppins = Poppins({
    weight: "400",
    subsets: [ "latin" ]
})
const Orders: FC = () => {
    const { loading, data, subscribeToMore } = useQuery(GetAllOrders)


    useEffect(() => {
        return subscribeToMore({
            document: OrderSubscriptions,
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev

                const ordersAdded = subscriptionData.data.createOrders

                return Object.assign({}, {
                    getAllOrders: [ ...prev.getAllOrders, ordersAdded ]
                })
            }
        })
    }, [ subscribeToMore ])

    return (
        <div className={styles.container}>
            <Head>
                <title>Orders</title>
            </Head>
            <div className={styles.table}>
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
                            <td></td>
                        </tr> : data.getAllOrders.map(({ orderID, order, itemCount, total, createdAt, orderCart }: { orderID: string, order: string, itemCount: number, total: number, createdAt: string, orderCart: [] }) => (
                            <OrdersTable key={orderID} orderID={orderID} order={order} itemCount={itemCount} total={total} date={createdAt} orderCart={orderCart} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

(Orders as PageWithLayout).layout = Dashboard
export default Orders