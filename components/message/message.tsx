import React from 'react'
import styles from './message.module.scss'
import { Poppins } from 'next/font/google'
import { TbCircleCheck } from 'react-icons/tb'

const poppins = Poppins({
    weight: "500",
    subsets: [ "latin" ],
})

export default function Message({ msg }: any) {
    return (
        <div className={styles.container}>
            <TbCircleCheck size={28} />
            <span className={poppins.className}>{msg}</span>
        </div>
    )
}
