import React, { SyntheticEvent, useState } from 'react'
import styles from './edit.module.scss'
import { UpdateMedicalItem } from '@/lib/util/Items/item.mutation'
import { useMutation } from '@apollo/client'
import { Oxygen } from 'next/font/google'
import { TbX } from 'react-icons/tb'
import { format } from 'date-fns'
import { getItemByCategoryid } from '@/lib/util/Items/item.query'
const oxygen = Oxygen({
    weight: "400",
    subsets: [ "latin" ]
})
export default function Edit({ close, id, items, dosage, price, quantity, expiredDate, userId, categoryID }: any) {


    const [ mItems, setMItems ] = useState({
        items: items,
        price: price,
        quantity: quantity,
        expiredDate: expiredDate,
        dosage: dosage
    })
    const [ UpdateMutate ] = useMutation(UpdateMedicalItem)

    const onHandleUpdateForm = (e: SyntheticEvent) => {
        e.preventDefault();
        UpdateMutate({
            variables: {
                itemsId: id,
                userId: userId,
                items: {
                    items: mItems.items,
                    price: parseFloat(mItems.price),
                    quantity: parseInt(mItems.quantity),
                    expiredDate: mItems.expiredDate,
                    dosage: mItems.dosage
                }
            },
            onCompleted: () => {
                alert("Successfully Updated")
            },
            refetchQueries: [ {
                query: getItemByCategoryid,
                variables: {
                    categoryId: categoryID
                }
            } ]
        })
    }
    return (
        <div className={styles.container}>
            <div className={styles.editHeader}>
                <h2 className={oxygen.className}>Edit Items</h2>
                <button onClick={close}>
                    <TbX size={23} />
                </button>
            </div>
            <form onSubmit={onHandleUpdateForm}>
                <div className={styles.ss}>
                    <div>
                        <label className={oxygen.className}>Items</label>
                        <input className={styles.inp} type="text" placeholder={mItems.items} onChange={(e) => setMItems({ ...mItems, items: e.target.value })} />
                    </div>
                    <div>
                        <label className={oxygen.className}>Dosage</label>
                        <input className={styles.inp} type="text" placeholder={mItems.dosage} onChange={(e) => setMItems({ ...mItems, dosage: e.target.value })} />
                    </div>
                    <div>
                        <label className={oxygen.className}>Price</label>
                        <input className={styles.inp} type="text" placeholder={Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(mItems.price)} onChange={(e) => setMItems({ ...mItems, price: e.target.value })} />
                    </div>

                    <div>
                        <label className={oxygen.className}>Quantity</label>
                        <input className={styles.inp} type="text" placeholder={mItems.quantity} onChange={(e) => setMItems({ ...mItems, quantity: e.target.value })} />
                    </div>
                    <div>
                        <label className={oxygen.className}>Expired Date</label>
                        <input className={styles.inp} type="date" placeholder={mItems.expiredDate === null ? "" : format(new Date(expiredDate), "MM/dd/yyyy")} onChange={(e) => setMItems({ ...mItems, expiredDate: e.target.value })} />
                    </div>

                </div>
                <div className={styles.addBtnGrp}>
                    <button type="submit" className={styles.addBtn}>Submit</button>
                </div>
            </form>
        </div>
    )
}
