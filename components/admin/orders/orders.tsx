import { format } from 'date-fns'
import React, { useState } from 'react'
import { Oxygen } from 'next/font/google'
import styles from '@/styles/dashboard/admin/orders/order.module.scss'
import OrderView from './orderView'

const oxygen = Oxygen({
    weight: "400",
    subsets: [ "latin" ]
})
export default function OrdersTable({ orderID, order, itemCount, total, date, orderCart }: { orderID: string, order: string, itemCount: number, total: number, date: string, orderCart: [] }) {


    const [ view, setView ] = useState(false)



    const onCloseView = () => {
        setView(() => !view)
    }
    return (
        <tr>
            <td className={oxygen.className}>{order}</td>
            <td className={oxygen.className}>{itemCount}</td>
            <td className={oxygen.className}>{Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(total)}</td>
            <td className={oxygen.className}>{format(new Date(date), "MMMM dd, yyyy")}</td>
            <td>
                {
                    view ?
                        <div className={styles.overlay}>
                            <OrderView orderNo={order} date={date} itemsCount={itemCount} close={onCloseView} total={total} orderCart={orderCart} />
                        </div> : null
                }
                <button onClick={() => setView(() => !view)} className={styles.viewBtn}>
                    <span className={oxygen.className}>View</span>
                </button>

            </td>
        </tr>
    )
}
