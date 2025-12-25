import React, { SyntheticEvent, useState, useRef } from 'react'
import { Oxygen, Rubik, Poppins } from 'next/font/google'
import { TbTrash, TbLogout } from 'react-icons/tb'
import { useQuery, useMutation, useReactiveVar } from '@apollo/client/react'
import { GET_CARTITEMS, carrItemsVar } from '@/lib/apollo/apolloWrapper'
import { CreateOrder } from '@/lib/apollo/order/order.mutation'
import { useReactToPrint } from 'react-to-print'
import styles from './order.module.scss'
import Head from 'next/head'
import ReceiptPdf from './receiptPdf'
import Logout from '@/components/settings/logout'
import Time from './time'

const rubik = Rubik({ display: "auto", weight: "500", subsets: ["latin"] })
const oxygen = Oxygen({ display: "auto", weight: "400", subsets: ["latin"] })
const poppins = Poppins({ display: "auto", weight: "500", subsets: ["latin"] })

// -------------------- TYPES --------------------
interface CartItem {
    itemsID: string
    items: string
    price: number
    quantity: number
    total: number
}

interface CartData {
    cartItems: CartItem[]
}

// -------------------- COMPONENT --------------------
export default function Orders() {
    const cart = useReactiveVar(carrItemsVar)
    const { loading, data } = useQuery<CartData>(GET_CARTITEMS)
    const [amountReceived, setAmountReceived] = useState<number>(0)
    const [settings, setSettings] = useState(false)
    const [printing, setPrinting] = useState(false)
    const [mutate] = useMutation(CreateOrder)

    const contentRef = useRef<HTMLDivElement>(null)

    const PRINTME: () => void = useReactToPrint({
        contentRef,
        onBeforePrint: async (): Promise<void> => {
            carrItemsVar([])
            setAmountReceived(0)
        },
        onAfterPrint: () => setPrinting(false)
    })

    if (loading) return <div>Loading...</div>

    const onHandleCloseLogout = () => setSettings(!settings)

    const onHandleOrder = (e: SyntheticEvent) => {
        e.preventDefault()
        if (!data) return

        mutate({
            variables: {
                orders: data.cartItems.map(({ itemsID, price, quantity }) => ({
                    itemsID,
                    quantity,
                    total: price * quantity
                }))
            },
            onCompleted: () => setPrinting(true),
            errorPolicy: "all"
        })
    }

    const reduceTotal = data?.cartItems.reduce((sum, item) => sum + item.total, 0) ?? 0
    const totalWithTax = reduceTotal + reduceTotal * 0.12
    const change = amountReceived - totalWithTax

    return (
        <div className={styles.container}>
            <Head><title>Pharmaceutical-Staff</title></Head>

            {/* PRINTING MODAL */}
            {printing && (
                <div className={styles.settings}>
                    <div className={styles.data}>
                        <span className={oxygen.className}>Amount Change</span>
                        <h2 className={poppins.className}>
                            {Intl.NumberFormat("en-US", { style: "currency", currency: "PHP" }).format(change)}
                        </h2>
                        <button onClick={PRINTME}>OK</button>
                    </div>
                </div>
            )}

            {/* SETTINGS MODAL */}
            {settings && <div className={styles.settings}><Logout close={onHandleCloseLogout} /></div>}

            {/* CURRENT CART HEADER */}
            <div className={styles.currentCart}>
                <div>
                    <h2 className={rubik.className}>Current Cart</h2>
                    <Time />
                </div>
                <div className={styles.settingsBtn}>
                    <button onClick={onHandleCloseLogout}><TbLogout size={23} /></button>
                </div>
            </div>

            {/* RECEIPT */}
            <div className={styles.receipt} ref={contentRef}>
                <ReceiptPdf data={data} amountReceived={amountReceived} />
            </div>

            {/* CART TABLE */}
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
                        {data?.cartItems.map((item: CartItem) => (
                            <tr key={item.itemsID}>
                                <td className={oxygen.className}>{item.items}</td>
                                <td className={oxygen.className}>x{item.quantity}</td>
                                <td className={oxygen.className}>
                                    {Intl.NumberFormat("en-US", { style: "currency", currency: "PHP" }).format(item.price)}
                                </td>
                                <td>
                                    <button
                                        onClick={() => {
                                            const updatedCart = cart.filter((a: { itemsID: string }) => a.itemsID !== item.itemsID)
                                            carrItemsVar(updatedCart)
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

            {/* ORDER SUMMARY */}
            <div className={styles.orders}>
                <div className={styles.change}>
                    <div className={styles.excah}>
                        <h2 className={rubik.className}>Enter Amount</h2>
                        <input
                            type="number"
                            value={amountReceived}
                            onChange={(e) => {
                                const val = parseFloat(e.target.value)
                                setAmountReceived(isNaN(val) ? 0 : val)
                            }}
                        />
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
                        <span className={oxygen.className}>{Intl.NumberFormat("en-US", { style: "currency", currency: "PHP" }).format(totalWithTax)}</span>
                    </div>
                    <div>
                        <h2 className={rubik.className}>Change</h2>
                        <span className={oxygen.className}>{Intl.NumberFormat("en-US", { style: "currency", currency: "PHP" }).format(change < 0 ? 0 : change)}</span>
                    </div>
                </div>

                <button disabled={amountReceived === 0 || amountReceived < totalWithTax} onClick={onHandleOrder}>
                    <span className={poppins.className}>Place Order</span>
                </button>
            </div>
        </div>
    )
}
