import React, { useState } from 'react'


import { format } from 'date-fns'
import { TbEdit, TbTrash } from 'react-icons/tb'
import Archive from './archive'
import Edit from './edit'
import styles from '@/styles/dashboard/manager/inventory/category.module.scss'
import { Oxygen } from 'next/font/google'


const oxygen = Oxygen({
    weight: "400",
    subsets: [ "latin" ]
})

export default function ItemTr({ itemsID, items, quantity, dosage, expiredDate, price, categoryID, userId }: any) {

    const [ ed, setEdit ] = useState(false)
    const [ del, setDelete ] = useState(false)


    const onHandleCloseDeleteItem = () => {
        setDelete(() => !del)
    }

    const onHandleCloseEditItem = () => {
        setEdit(() => !ed)
    }

    return (
        <tr key={itemsID}>
            <td className={oxygen.className}>{items}</td>
            <td className={oxygen.className}>{Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(price)}</td>
            <td className={oxygen.className}>x{quantity}</td>
            <td className={oxygen.className}>{dosage === null ? "N/A" : dosage}</td>
            <td className={oxygen.className}>{expiredDate === null ? "N/A" : format(new Date(expiredDate), "MMMM dd, yyyy")}</td>
            <td className={styles.actionsBtn}>
                <button className={styles.actBtn} onClick={onHandleCloseEditItem}>
                    <TbEdit size={23} />
                </button>
                <button className={styles.actBtn} onClick={onHandleCloseDeleteItem}>
                    <TbTrash size={23} />
                </button>
                {
                    del ?
                        <div className={styles.overlay}>
                            <Archive close={onHandleCloseDeleteItem} id={itemsID} categoryID={categoryID} userId={userId} />
                        </div> : null
                }
                {
                    ed ?
                        <div className={styles.overlay2}>
                            <Edit close={onHandleCloseEditItem} id={itemsID} items={items} dosage={dosage} price={price} quantity={quantity} expiredDate={expiredDate} userId={userId} categoryID={categoryID} />
                        </div> : null
                }
            </td>
        </tr>
    )
}
