import React, { useState } from 'react'
import { format } from 'date-fns'
import { Oxygen } from 'next/font/google'
import { TbArchive } from 'react-icons/tb'
import styles from '@/components/admin/archive/User/user.module.scss'
import ArchivePrompt from '../prompt/archivePrompt'

const poppins = Oxygen({
    weight: "400",
    subsets: [ "latin" ]
})
export default function UserQueryArchive({ email, archiveID, date, role, userID, salary, myProfile, userIds }: { email: string, archiveID: string, date: any, role: string, userID: string, salary: [], myProfile: [], userIds: string }) {

    const [ prompt, setPrompt ] = useState(false)


    const onHandleUnArchive = () => {
        setPrompt(() => !prompt)
    }
    return (
        <tr key={userID}>
            {myProfile.map(({ fullname }) => (
                <td className={poppins.className} key={fullname}>{fullname}</td>
            )
            )}
            <td className={poppins.className}>{email}</td>
            <td className={poppins.className}>{role.toUpperCase()}</td>
            {myProfile.map(({ phone }: { phone: string }) => (
                <td key={phone} className={poppins.className}>{phone?.replace("+63", "0")}</td>
            )
            )}
            <td className={poppins.className}>{format(new Date(date), "MMMM dd, yyyy")}</td>
            <td className={styles.actionsBtn}>
                {
                    prompt ? <div className={styles.overlay}>
                        <ArchivePrompt close={onHandleUnArchive} archiveID={archiveID} tab={'user'} label={"User?"} userIds={userIds} />
                    </div> : null
                }
                <button onClick={onHandleUnArchive} className={styles.actBtn}>
                    <TbArchive size={23} />
                </button>
            </td>
        </tr>
    )
}
