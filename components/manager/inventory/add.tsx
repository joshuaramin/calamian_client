import React, { SyntheticEvent, useEffect, useState } from 'react'
import styles from './add.module.scss'
import { Poppins, Oxygen } from 'next/font/google'
import { useMutation } from '@apollo/client'
import { ItemMutation } from '@/lib/util/Items/item.mutation'
import Message from '@/components/message/message'
const poppins = Poppins({
    weight: "500",
    subsets: [ "latin" ]
})

const oxygen = Oxygen({
    weight: "400",
    subsets: [ "latin" ]
})
export default function AddItem({ close, categoryID, userID }: any) {

    const [ numberOfDosage, setNumberOfDosage ] = useState(false)
    const [ expirationDate, setExpirationDate ] = useState(false)
    const [ message, setMessage ] = useState<boolean>(false)


    const [ items, setItems ] = useState({
        items: "",
        dosage: "",
        price: 0.00,
        quantity: 0,
        expiredDate: ""

    })


    const [ mutate, { data, error } ] = useMutation(ItemMutation)


    const onHandleMutation = (e: SyntheticEvent) => {
        e.preventDefault()
        mutate({
            variables: {
                categoryId: categoryID,
                userId: userID,
                items: {
                    expiredDate: expirationDate ? items.expiredDate : null,
                    dosage: numberOfDosage ? items.dosage : null,
                    items: items.items,
                    price: items.price,
                    quantity: items.quantity
                }
            },
            errorPolicy: "all",
            onCompleted: () => {
                setMessage(true)
                setItems({
                    dosage: numberOfDosage ? items.dosage : "",
                    expiredDate: "",
                    items: "",
                    price: 0.00,
                    quantity: 0
                })
            }
        })
    }


    const onHandelDosageForm = () => {
        setNumberOfDosage(() => !numberOfDosage)
    }


    const onHandleExpirationForm = () => {
        setExpirationDate(() => !expirationDate)
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setMessage(false)
        }, 2000);


        return () => clearInterval(interval)
    }, [ message ])

    return (

        <div className={styles.container}>
            {
                data && message === true ? <Message msg="Successfully Added" /> : null
            }
            <h2 className={poppins.className}>Add Item</h2>
            <form onSubmit={onHandleMutation}>
                <label className={oxygen.className}>Item Name</label>
                <input className={styles.inp} type='text' placeholder='Item Name'
                    value={items.items}
                    onChange={(e) => setItems({ ...items, items: e.target.value })} />
                <label className={oxygen.className}
                >Quantity</label>
                <input className={styles.inp} type='text' placeholder='Quantity'
                    value={items.quantity}
                    onChange={(e) => {
                        setItems({ ...items, quantity: parseInt(e.currentTarget.value) }

                        )
                        if (isNaN(parseInt(e.target.value))) {
                            setItems({ ...items, quantity: "" as unknown as number })
                        }
                    }}
                />
                <label className={oxygen.className}>Price</label>
                <input className={styles.inp} type='text' placeholder='Price'
                    value={items.price}
                    onChange={(e) => {
                        setItems({ ...items, price: parseFloat(e.target.value) })
                        if (isNaN(parseInt(e.target.value))) {
                            setItems({ ...items, price: "" as unknown as number })
                        }
                    }} />
                {expirationDate ? <div className={styles.ss}>
                    <label className={oxygen.className}>Expired Date</label>
                    <input className={styles.inp} type="date" placeholder='Expired Date'
                        value={items.expiredDate}
                        onChange={(e) => setItems({ ...items, expiredDate: e.target.value })}
                    />
                </div> : null}
                {numberOfDosage ? <div className={styles.ss}>
                    <label className={oxygen.className}>Dosage</label>
                    <input className={styles.inp} type="text" placeholder='How many Dosage'
                        value={items.dosage}
                        onChange={(e) => setItems({ ...items, dosage: e.target.value })}
                    />
                </div> : null}
                <div className={styles.check}>
                    <input type="checkbox" onChange={onHandelDosageForm} />
                    <label className={oxygen.className}>Dosage</label>
                    <input type="checkbox" onChange={onHandleExpirationForm} />
                    <label className={oxygen.className}>Expired Date</label>
                </div>
                <div className={styles.addBtnGrp}>
                    <button onClick={close} type="button" className={`${styles.cancelBtn} ${poppins.className}`}>Cancel</button>
                    <button disabled={!items.items || !items.price || !items.quantity} type="submit" className={`${styles.addBtn} ${poppins.className}`}>Add item </button>
                </div>
            </form>
        </div>
    )
}
