import React from 'react'
import styles from './orderView.module.scss'
import { Poppins, Oxygen, Oxygen_Mono, Rubik } from 'next/font/google'
import { TbX, TbPrinter } from 'react-icons/tb'
import { format } from 'date-fns'

const poppins = Poppins({
    weight: '600',
    subsets: [ 'latin' ]
})


const rubik = Rubik({
    weight: "400",
    subsets: [ "latin" ]
})


const oxygen = Oxygen({
    weight: "400",
    subsets: [ "latin" ]
})

const oxymon = Oxygen_Mono({
    weight: "400",
    subsets: [ "latin" ]
})

export default function OrderView({ orderNo, date, itemsCount, close, orderCart }: any) {

    const reduceTotal = orderCart.reduce((a: any, b: any) => (a + b.total), 0)
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={poppins.className}>Order {orderNo}</h2>
                <button onClick={close}>
                    <TbX size={23} />
                </button>
            </div>
            <div className={styles.orderDetails}>
                <span className={oxygen.className}><b>Date: </b>{format(new Date(date), "MMMM dd, yyyy")}</span>
            </div>
            <div className={styles.summary}>
                <h2 className={poppins.className}>Summary</h2>
                <div className={styles.cart}>
                    <table className={styles.cartItem}>
                        <thead>
                            <tr>
                                <th className={oxymon.className}>Name</th>
                                <th className={oxymon.className}>Quantity</th>
                                <th className={oxymon.className}>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderCart.map(({ cartItem, orderListItemID, quantity, total }: any) => (
                                cartItem.map(({ items }: any) => (


                                    <tr key={orderListItemID}>
                                        <td className={oxymon.className}>{items}</td>
                                        <td className={oxymon.className}>x{quantity}</td>
                                        <td className={oxymon.className}>{Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(total)}</td>
                                    </tr>


                                ))
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className={styles.total}>
                <div>
                    <h2 className={rubik.className}>SubTotal</h2>
                    <span className={oxygen.className}>{Intl.NumberFormat("en-US", { style: "currency", currency: "PHP" }).format(reduceTotal)}</span>
                </div>
                <div>
                    <h2 className={rubik.className}>Tax</h2>
                    <span className={oxygen.className}>%12</span>
                </div>
                <div>
                    <h2 className={rubik.className}>Total</h2>
                    <span className={oxygen.className}>{Intl.NumberFormat("en-US", { style: "currency", currency: "PHP" }).format(reduceTotal + (reduceTotal * 0.12))}</span>
                </div>
            </div>
            <div className={styles.btngp}>
                <button onClick={close}>
                    <span className={oxygen.className}>Done</span>
                </button>
            </div>
        </div>
    )
}
