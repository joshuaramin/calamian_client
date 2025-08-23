import React, { SyntheticEvent, useState, useRef } from 'react'
import { Oxygen, Rubik, Poppins } from 'next/font/google'
import { TbTrash, TbLogout } from 'react-icons/tb'
import { useQuery, useMutation, useReactiveVar } from '@apollo/client'
import { GET_CARTITEMS, carrItemsVar } from '@/lib/apollo/apolloWrapper'
import { CreateOrder } from '@/lib/apollo/order/order.mutation'
import { useReactToPrint } from 'react-to-print'
import styles from './order.module.scss'
import Head from 'next/head'
import ReceiptPdf from './receiptPdf'
import Logout from '@/components/settings/logout'
import Time from './time'

const rubik = Rubik({
    display: "auto",
    weight: "500",
    subsets: ["latin"]
})

const oxygen = Oxygen({
    weight: "400",
    display: "auto",
    subsets: ["latin"]
})

const poppins = Poppins({
    weight: "500",
    display: "auto",
    subsets: ["latin"]
})

interface Items {
    itemsID: string
    items: string
    price: number
    quan: number
    category: []
    storeInfo: []
}


export default function Orders() {

    const cart = useReactiveVar(carrItemsVar)
    const { loading, data } = useQuery(GET_CARTITEMS)
    const [amountReceived, setAmountReceived] = useState(0)
    const [settings, setSettings] = useState(false)
    const [printing, setPrinting] = useState(false)
    const [mutate] = useMutation(CreateOrder)


    const componentToprint = useRef(null)


    const PRINTME = useReactToPrint({
        content: () => componentToprint.current,
        removeAfterPrint: true,
        onBeforePrint: () => {
            carrItemsVar([])
            setAmountReceived(0)
        },
        onAfterPrint: () => {
            setPrinting(false)
        }
    })

    if (loading) return <div>Loading...</div>



    const onHandleCloseLogout = () => {
        setSettings(() => !settings)
    }


    const onHandleOrder = (e: SyntheticEvent) => {
        e.preventDefault();
        mutate({
            variables: {
                orders: data.cartItems.map(({ itemsID, price, quantity }: { itemsID: string; quantity: number; price: number }) => {
                    return { itemsID, quantity, total: price * quantity }
                })
            },

            onCompleted: () => {
                setPrinting(true)
            },

            errorPolicy: "all"
        })
    }

    const reduceTotal = data.cartItems.reduce((a: any, b: any) => (a + b.total), 0)

    return (
        <div className={styles.container}>
            <Head>
                <title>Pharmaceutical-Staff</title>
            </Head>
            {
                printing ?
                    <div className={styles.settings}>
                        <div className={styles.data}>
                            <span className={oxygen.className}>Amount Change</span>
                            <h2 className={poppins.className}>
                                {Intl.NumberFormat("en-US", { style: "currency", currency: "PHP" }).format(amountReceived - (reduceTotal + (reduceTotal * 0.12)))}
                            </h2>
                            <button onClick={PRINTME}>OK</button>
                        </div>
                    </div> : null
            }
            {
                settings ? <div className={styles.settings}>
                    <Logout close={onHandleCloseLogout} />
                </div> : null
            }
            <div className={styles.currentCart}>
                <div>
                    <h2 className={rubik.className}>Current Cart</h2>
                    <Time />
                </div>
                <div className={styles.settingsBtn}>
                    <button onClick={() => setSettings(() => !settings)}>
                        <TbLogout size={23} />
                    </button>
                </div>
            </div>
            <div className={styles.receipt} ref={componentToprint}>
                <ReceiptPdf data={data} amountReceived={amountReceived} />
            </div>
            <div className={styles.cartContainer}>
                <table>
                    <thead>
                        <tr>
                            <th className={poppins.className}>Name</th>
                            <th className={poppins.className}>Quantity</th>
                            <th className={poppins.className}>Price</th>
                            <th className={poppins.className}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.cartItems.map(({ itemsID, items, price, quantity }: { itemsID: string, items: string, price: number, quantity: number }) => (
                            <tr key={itemsID}>
                                <td className={oxygen.className}>{items}</td>
                                <td className={oxygen.className}>x{quantity}</td>
                                <td className={oxygen.className}>{Intl.NumberFormat("en-US", { style: "currency", currency: "PHP" }).format(price)}</td>
                                <td>
                                    <button
                                        onClick={() => {

                                            const currentItem = cart.some((a: Items) => (a.itemsID === itemsID))
                                            const removeDuplicateItem = cart.filter((a: Items) => a.itemsID !== itemsID)
                                            carrItemsVar(currentItem ? removeDuplicateItem : [])
                                        }}
                                    >
                                        <TbTrash size={23} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className={styles.orders}>

                <div className={styles.change}>
                    <div className={styles.excah}>
                        <h2 className={rubik.className}>Enter Amount</h2>
                        <input type="text" value={amountReceived} onChange={(e) => {
                            setAmountReceived(parseInt(e.target.value))
                            if (isNaN(parseInt(e.target.value))) {
                                setAmountReceived(0)
                            }

                        }} />
                    </div>
                    <div>
                        <h2 className={rubik.className}>Subtotal</h2>
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
                    <div>
                        <h2 className={rubik.className}>Change</h2>
                        <span className={oxygen.className}>{isNaN(amountReceived) ? Intl.NumberFormat("en-US", { style: "currency", currency: "PHP" }).format(0) : Intl.NumberFormat("en-US", { style: "currency", currency: "PHP" }).format(amountReceived - (reduceTotal + (reduceTotal * 0.12)))}</span>
                    </div>
                </div>
                <button disabled={amountReceived === 0 || amountReceived < reduceTotal} onClick={onHandleOrder}>
                    <span className={poppins.className}>Place Order</span>
                </button>
            </div>
        </div >
    )
}
