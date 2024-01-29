import React, { useState } from 'react'
import { TbDotsVertical, TbFolder } from 'react-icons/tb'
import styles from '@/styles/dashboard/manager/inventory/inventory.module.scss'
import { useRouter } from 'next/router'
import { Poppins } from 'next/font/google'
import Rename from './renameCategory'
import DeleteCategory from './archive'



const poppins = Poppins({
    weight: "400",
    subsets: [ "latin" ]
})

type Category = {
    categoryID: string
    category: string
    userID: string
}

export default function CardCategory({ categoryID, category, userID }: Category) {

    const [ optionsBtn, setOptionsBtn ] = useState(false)
    const [ renameBtn, setRenameBtn ] = useState(false)
    const [ archiveBtn, setArchiveBtn ] = useState(false)

    const onCancelHandle = () => {
        setRenameBtn(false)
    }

    const onCancelDeleteHandle = () => {
        setArchiveBtn(false)
    }

    const router = useRouter()
    return (
        <div className={styles.categoryCard} key={categoryID}>
            {
                renameBtn ?
                    <div className={styles.overlay}>
                        <Rename close={onCancelHandle} categoryID={categoryID} category={category} userID={userID} />
                    </div> : null
            }
            {
                archiveBtn ?
                    <div className={styles.overlay}>
                        <DeleteCategory close={onCancelDeleteHandle} categoryID={categoryID} userID={userID} />
                    </div> : null
            }
            <div onClick={() => router.push(`${router.pathname}/${categoryID}`)} className={styles.card}>
                <TbFolder size={25} />
                <span className={poppins.className}>{category}</span>
            </div>
            <div className={styles.btnGrp}>
                <button onClick={() => setOptionsBtn(() => !optionsBtn)} className={styles.btnVertical}>
                    <TbDotsVertical />
                </button>
                {optionsBtn ? <div className={styles.options}>
                    <button onClick={() => {
                        setRenameBtn(() => !renameBtn)
                        if (optionsBtn === true) {
                            setOptionsBtn(false)
                        }
                    }}>Rename</button>
                    <button onClick={() => {
                        setArchiveBtn(() => !archiveBtn)
                        if (optionsBtn === true) {
                            setOptionsBtn(false)
                        }
                    }}>Archive</button>
                </div> : null}
            </div>
        </div>
    )
}
