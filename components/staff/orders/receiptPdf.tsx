import React from 'react'
import styles from '@/styles/receipt.module.scss'
import { Oxygen_Mono, Rubik } from 'next/font/google'
import { format } from 'date-fns'

const oxymono = Oxygen_Mono({
    weight: "400",
    subsets: [ "latin" ]
})

const rubik = Rubik({
    weight: "400",
    subsets: [ "latin" ]
})

const Receipt = ({ data, amountReceived }: { data: any, amountReceived: number }) => {
    const reduceTotal = data.cartItems.reduce((a: any, b: any) => (a + b.total), 0)

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={rubik.className}>Calamian MDs Pharmacy,</h2>
                <span className={oxymono.className}>Ventura{"'"}s Residence, Salvacion, Busuanga, Palawan, Philippines</span>
            </div>
            <div className={styles.time}>
                <h2 className={rubik.className}>Date: </h2>
                <span>{format(new Date(Date.now()), "MMM dd, yyyy hh:mm:aa")}</span>
            </div>
            <div className={styles.divider}>-------------------------------------</div>
            <div className={styles.table}>
                <table>
                    <tbody>
                        {data.cartItems.map(({ itemsID, items, price, quantity }: { itemsID: string, items: string, price: number, quantity: number }) => (
                            <tr key={itemsID}>
                                <td className={oxymono.className}>{items}</td>
                                <td className={oxymono.className}>x{quantity}</td>
                                <td>{Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(price)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
            <div className={styles.divider}>-------------------------------------</div>

            <div className={styles.totals}>
                <table>
                    <tbody>
                        <tr>
                            <td className={oxymono.className}>SubTotal</td>
                            <td>{Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(reduceTotal)}</td>
                        </tr>
                        <tr>
                            <td>Tax</td>
                            <td>%12</td>
                        </tr>
                        <tr>
                            <td>Total</td>
                            <td>{Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(reduceTotal + (reduceTotal * 0.12))}</td>
                        </tr>
                    </tbody>

                </table>

                <div className={styles.divider}>-------------------------------------</div>

                <table>
                    <tbody>
                        <tr>
                            <td className={oxymono.className}>Amount Recieved</td>
                            <td>{isNaN(amountReceived) ? Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(0) : Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(amountReceived)}</td>
                        </tr>
                        <tr>
                            <td className={oxymono.className}>Change Amount</td>
                            <td>{isNaN(amountReceived) ? Intl.NumberFormat("en-US", { style: "currency", currency: "PHP" }).format(0) : Intl.NumberFormat("en-US", { style: "currency", currency: "PHP" }).format(amountReceived - (reduceTotal + (reduceTotal * 0.12)))}</td>
                        </tr>
                    </tbody>
                </table>



                <div className={styles.divider}>-------------------------------------</div>
                <div className={styles.footer}>
                    <h2 className={rubik.className}>Acknowledgement Receipt</h2>
                    <span className={oxymono.className}>Thank you</span>
                </div>
            </div>




        </div>

    )

}


export default Receipt