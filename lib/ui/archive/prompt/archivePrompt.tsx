import React, { SyntheticEvent, useEffect, useState } from 'react'
import styles from './archivePrompt.module.scss'
import { Poppins, Oxygen } from 'next/font/google'
import { UpdateArchive } from '@/lib/apollo/archive/archive.mutation'
import { useMutation } from '@apollo/client'
import { GetAllArchive } from '@/lib/apollo/archive/archive.query'
import { useRouter } from 'next/router'
import Message from '@/components/message/message'

const poppins = Poppins({
    weight: "500",
    subsets: ["latin"]
})

const oxygen = Oxygen({
    weight: "400",
    subsets: ["latin"]
})
export default function ArchivePrompt({ archiveID, label, close, tab, userIds }: { archiveID: string, label: string, close: () => void, tab: any, userIds: string }) {

    const router = useRouter();
    const [mutate, { data }] = useMutation(UpdateArchive)

    const [message, setMessage] = useState<boolean>(false)
    const onHandleUnArchiveForm = (e: SyntheticEvent) => {
        e.preventDefault();
        mutate({
            variables: {
                archiveId: archiveID,
                userId: userIds
            },
            onCompleted: () => {
                setMessage(true)
                close();
                router.reload()
            },
            refetchQueries: [{
                query: GetAllArchive,
                variables: {
                    tab: tab
                }
            }]
        })
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setMessage(false)
        }, 2000);


        return () => clearInterval(interval)
    }, [message])


    return (
        <div className={styles.container}>
            {!data && message === false ? <Message msg="Successfully UnArchive" /> : null}
            <h2 className={poppins.className}>Archive</h2>
            <span className={oxygen.className}>Are you sure you want to unarchive this {label}</span>
            <form onSubmit={onHandleUnArchiveForm}>
                <div className={styles.addBtnGrp}>
                    <button onClick={close} type="button" className={`${styles.cancelBtn} ${poppins.className}`}>Cancel</button>
                    <button type="submit" className={`${styles.addBtn} ${poppins.className}`}>Yes, unarchive this {label}</button>
                </div>
            </form>
        </div>
    )
}
