import React, { useState } from 'react'
import { format } from 'date-fns'
import { Oxygen } from 'next/font/google'
import { TbArchive } from 'react-icons/tb'
import ArchivePrompt from '../prompt/archivePrompt'
import styles from './categoies.module.scss'


const poppins = Oxygen({
    weight: "400",
    subsets: [ "latin" ]
})


export default function CategoriesQuery({ archiveID, name, date, count, userIds }: { archiveID: string, name: string, date: any, count: number, userIds: string }) {

    const [ prompt, setPrompt ] = useState(false)

    const onHandleUnArchive = () => {
        setPrompt(() => !prompt)
    }
    return (
        <tr>
            <td className={poppins.className}>{name}</td>
            <td className={poppins.className}>{count}</td>
            <td className={poppins.className}>{format(new Date(date), "MMMM dd, yyyy")}</td>
            <td className={styles.actionsBtn}>
                {
                    prompt ? <div className={styles.overlay}>
                        <ArchivePrompt close={onHandleUnArchive} archiveID={archiveID} tab={'user'} label={"Expense Folder?"} userIds={userIds} />
                    </div> : null
                }
                <button onClick={onHandleUnArchive} className={styles.actBtn}>
                    <TbArchive size={23} />
                </button>
            </td>
        </tr>
    )
}
