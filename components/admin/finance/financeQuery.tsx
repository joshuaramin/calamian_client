import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { TbDotsVertical, TbFolder } from 'react-icons/tb';
import { Poppins } from 'next/font/google';
import RenameFinanceFolder from './rename';
import DeleteExpenseFolders from './delete';
import styles from '@/styles/dashboard/admin/finance/finance.module.scss'


const poppins = Poppins({
    weight: "400",
    subsets: [ "latin" ]
})


export default function FinanceQuery({ expFolderID, exFolder, date, userID }: { exFolder: string, expFolderID: string, date: string, userID: string }) {

    const router = useRouter();


    const [ optionsBtn, setOptionsBtn ] = useState(false);
    const [ renameBtn, setRenameBtn ] = useState(false);
    const [ deleteBtn, setDeleteBtn ] = useState(false);

    const onHandleRenameBtn = () => {
        setRenameBtn(false);
    }

    const onHandleDeleteBtn = () => {
        setDeleteBtn(false)
    }
    return (
        <div className={styles.categoryCard} >
            {
                renameBtn ? <div className={styles.overlay}>
                    <RenameFinanceFolder close={onHandleRenameBtn} exFolder={exFolder} expFolderID={expFolderID} userID={userID} />
                </div> : null
            }
            {
                deleteBtn ? <div className={styles.overlay}>
                    <DeleteExpenseFolders close={onHandleDeleteBtn} expFolderId={expFolderID} userID={userID} />
                </div> : null
            }
            <div className={styles.card} onClick={() => router.push(`/dashboard/admin/finance/${expFolderID}`)}>
                <TbFolder size={23} />
                <span className={poppins.className}>{exFolder.length >= 20 ? `${exFolder}...` : exFolder}</span>
            </div>
            <div className={styles.btnGrp}>
                <button onClick={() => setOptionsBtn(() => !optionsBtn)} className={styles.btnVertical}>
                    <TbDotsVertical />
                </button>
                {
                    optionsBtn ? <div className={styles.options}>
                        <button onClick={() => {
                            setRenameBtn(() => !renameBtn)
                            if (optionsBtn === true) {
                                setOptionsBtn(false)
                            }
                        }}>Rename</button>
                        <button onClick={() => {
                            setDeleteBtn(() => !deleteBtn)
                            if (optionsBtn === true) {
                                setOptionsBtn(false)
                            }
                        }}>Delete</button>
                    </div> : null
                }
            </div>
        </div>
    )
}
