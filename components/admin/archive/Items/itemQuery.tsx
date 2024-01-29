import React, { useState } from 'react'
import { TbArchive } from 'react-icons/tb'
import { Oxygen } from 'next/font/google'
import { format } from 'date-fns'
import ArchivePrompt from '../prompt/archivePrompt'
import styles from './items.module.scss'

const poppins = Oxygen({
    weight: "400",
    subsets: [ "latin" ]
})



export default function ItemQuery({ items, dosage, archiveID, price, expiredDate, date, userIds }: {
    items: string, dosage: string, archiveID: string, price: number, expiredDate: any, date: any, userIds: string
}) {

    const [ prompt, setPrompt ] = useState(false)

    const onHandleUnArchive = () => {
        setPrompt(() => !prompt)
    }
    return (
        <tr>
            <td className={poppins.className}>{items}</td>
            <td className={poppins.className}>{dosage === null ? "N/A" : dosage}</td>
            <td className={poppins.className}>{Intl.NumberFormat("en-US", { style: "currency", currency: "PHP" }).format(price)}</td>
            <td className={poppins.className}>{format(new Date(expiredDate), "MMMM dd, yyyy")}</td>
            <td className={poppins.className}>{date === null ? "N/A" : format(new Date(date), "MMMM dd, yyyy")}</td>
            <td className={styles.actionsBtn}>
                {
                    prompt ? <div className={styles.overlay}>
                        <ArchivePrompt close={onHandleUnArchive} archiveID={archiveID} tab={'item'} label={"item?"} userIds={userIds} />
                    </div> : null
                }
                <button onClick={onHandleUnArchive} className={styles.actBtn}>
                    <TbArchive size={23} />
                </button>
            </td>
        </tr>
    )
}
