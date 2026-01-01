"use client"

import Dashboard from '@/layout/dashboard.layout'
import PageWithLayout from '@/layout/page.layout'
import React, { FC } from 'react'
import Head from 'next/head'
import styles from '@/styles/dashboard/orders/order.module.scss'
import { GetAllOrders } from '@/lib/apollo/order/order.query'
import { useQuery } from '@apollo/client/react'
import OrdersTable from '@/lib/ui/orders/orders'
import { poppins } from '@/lib/typography'

// Table headers
const orderTableHead = ["Orders No.", "No. of Items", "Total", "Order Created", "Action"]

// Type for a single order
type OrderItem = {
    orderID: string
    order: string
    itemCount: number
    total: number
    createdAt: string
    orderCart: any // you can define a stricter type if available
}

// Type for query result
type GetAllOrdersQuery = {
    getAllOrders: OrderItem[]
}

const Orders: FC = () => {
    const { loading, data, error } = useQuery<GetAllOrdersQuery>(GetAllOrders)

    if (error) return <p>Error loading orders: {error.message}</p>

    const orders = data?.getAllOrders ?? []

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
                        {loading ? (
                            <tr>
                                <td colSpan={5} style={{ textAlign: "center" }}>Loading orders...</td>
                            </tr>
                        ) : orders.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ textAlign: "center" }}>No orders found.</td>
                            </tr>
                        ) : (
                            orders.map(({ orderID, order, itemCount, total, createdAt, orderCart }) => (
                                <OrdersTable
                                    key={orderID}
                                    orderID={orderID}
                                    order={order}
                                    itemCount={itemCount}
                                    total={total}
                                    date={createdAt}
                                    orderCart={orderCart}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

// Apply layout
(Orders as PageWithLayout).layout = Dashboard
export default Orders
