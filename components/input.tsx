import React, { ChangeEvent, useEffect, useState } from 'react'
import styles from '@/styles/components/input.module.scss'
import { poppins } from '@/lib/typography'
import { TbMail } from 'react-icons/tb'
import { FieldError, FieldValues, UseFormRegister } from 'react-hook-form'
import cn from '@/lib/util/cn'


interface InputFieldProps<T extends FieldValues = any> {
    icon: boolean
    label: string;
    name: keyof T & string;
    type?: string;
    isRequired: boolean;
    placeholder?: string;
    error: FieldError | undefined;
    register: UseFormRegister<T>;
}

export function InputText({ icon, name, label, register, error, isRequired, placeholder, type }: InputFieldProps) {


    return (
        <div className={styles.inputText}>
            <div className={styles.header}>
                <label className={cn(styles.label, poppins.className)}>{label}</label>
                {isRequired && <span className={styles.isRequired}>*</span>}
            </div>
            <div className={styles.body}>
                {icon ? <div>
                    <TbMail size={22} />
                </div> : null}
                <input
                    type={type}
                    id={name}
                    className={poppins.className}
                    placeholder={placeholder}
                    {...register(name, { valueAsNumber: type === "number" ? true : false })}
                />
            </div>
            <div className={styles.errorBody}>
                <span className={cn(poppins.className, styles.error)}>{error?.message}</span>
            </div>
        </div>
    )
}
