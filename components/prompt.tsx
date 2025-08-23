import React, { FC, FormEventHandler, forwardRef, ReactNode } from 'react'
import styles from '@/styles/components/prompt.module.scss';
import { TbX } from 'react-icons/tb';
import { oxygen, poppins, rubik } from '@/lib/typography';




interface Props {
    title: string;
    body?: ReactNode;
    headerClose: boolean;
    submitHandler: FormEventHandler<HTMLFormElement>;
    buttoName?: string
    onClose: () => void;
    footer: boolean;
}

const CentralPrompt: FC<Props> = forwardRef<HTMLDivElement, Props>(({ footer, buttoName, submitHandler, headerClose, onClose, title, body }, ref) => {


    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };


    return (
        <div ref={ref} onClick={handleBackdropClick} className={styles.container}>
            <div className={styles.promptContainer}>
                <div className={styles.header}>
                    <h1 className={poppins.className}>{title}</h1>
                    {headerClose && (
                        <button onClick={onClose}>
                            <TbX size={23} />
                        </button>)
                    }
                </div>
                <div className={styles.body}>{body}</div>
                {footer && (
                    <div className={styles.footer}>
                        <button type="button" onClick={onClose} className={styles.cancelBtn}>
                            <span className={oxygen.className}>Cancel</span>
                        </button>
                        <form onSubmit={submitHandler}>
                            <button type="submit" className={styles.saveBtn}>
                                <span className={oxygen.className}>{buttoName}</span>
                            </button>
                        </form>
                    </div>
                )}
            </div>

        </div>
    )
})

CentralPrompt.displayName = "CentralPrompt"

export default CentralPrompt