"use client"

import React, { ChangeEvent, useState } from 'react'
import styles from '@/styles/components/select.module.scss';
import { poppins } from '@/lib/typography';
import cn from '@/lib/util/cn';
import { FieldError, UseFormRegister, FieldValues } from 'react-hook-form';
import { TbCaretDownFilled, TbCaretUpFilled } from 'react-icons/tb';


type Options = {
    value: string
    label: string
}

interface Props<T extends FieldValues = any> {
    ref?: any,
    label: string
    name: string
    isRequired: boolean
    error: FieldError | undefined
    options: Array<Options>
    setValue: any
    value: any
    register: UseFormRegister<T>
}

export function Select({ ref, label, error, register, name, isRequired, options, setValue, value }: Props) {

    const [toggle, setToggle] = useState<boolean>(false);

    const onHandleToggle = () => {
        setToggle(() => !toggle)
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <label className={cn(styles.label, poppins.className)}>{label}</label>
                {isRequired ? <span className={styles.isRequired}>*</span> : null}
            </div>
            <div className={styles.select}>
                <div className={styles.selectContainer} {...register(name)}>
                    <span className={cn(poppins.className, styles.categoryspan)}>
                        {options.find(option => option.value === value)?.label || `Please select a ${label.toLowerCase()}`}
                    </span>


                    <button onClick={onHandleToggle}>
                        {toggle ? <TbCaretUpFilled size={23} /> : <TbCaretDownFilled size={23} />}
                    </button>
                </div>
                {toggle &&
                    <div className={styles.optionContainer}>
                        <div className={styles.option}>
                            {options.map(({ label, value }) => (
                                <button
                                    value={value}
                                    key={value}
                                    type="button"
                                    className={styles.option}
                                    onClick={() => {
                                        setValue(name, value);
                                        setToggle(false);
                                    }}
                                >{label}</button>
                            ))}
                        </div>
                    </div>}
            </div>
            <div className={styles.errorBody}>
                <span className={styles.error}>{error?.message}</span>
            </div>
        </div >
    )
}

interface SelectArrayProps<T extends FieldValues = any> {
    label: string
    name: string
    isRequired: boolean
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
    error?: FieldError | undefined;
    options: Array<Options>
    setValue: any
    value: any
    register: UseFormRegister<T>
}

export function SelectArray({ label, name, isRequired, error, onChange, options, register, setValue, value }: SelectArrayProps) {


    const [val, setVal] = useState<string[]>([])
    const [toggle, setToggle] = useState<boolean>(false);


    const onHandleToggle = () => {
        setToggle(() => !toggle)
    }

    return (
        <div className={styles.array}>
            <div className={styles.header}>
                <label className={cn(styles.label, poppins.className)}>{label}</label>
                {isRequired ? <span className={styles.isRequired}>*</span> : null}
            </div>
            <div className={styles.select}>
                <div className={styles.selectContainer} {...register(name)}>

                    <div className={styles.sc}>
                        {
                            val ? val.map((value, index) => (
                                <div key={index} className={styles.options}>
                                    <span className={cn(poppins.className, styles.categoryspan)}>
                                        {options.find(option => option.value === value)?.label}
                                    </span>

                                </div>
                            )) :
                                <span className={cn(poppins.className, styles.categoryspan)}>
                                    {options.find(option => option.value === value)?.label || `Please select a ${label.toLowerCase()}`}
                                </span>
                        }
                    </div>


                    <button onClick={onHandleToggle}>
                        {toggle ? <TbCaretUpFilled size={23} /> : <TbCaretDownFilled size={23} />}
                    </button>
                </div>
                {toggle &&
                    <div className={styles.optionContainer}>
                        <input
                            type="text"
                            onChange={onChange}
                            placeholder='Search here'
                        />
                        <div className={styles.option}>
                            {options.map(({ label, value }) => (
                                <button
                                    value={value}
                                    key={value}
                                    type="button"
                                    className={cn(val.includes(value) && styles.active)}
                                    onClick={() => {
                                        setVal((prev) =>
                                            prev.includes(value)
                                                ? prev.filter((v) => v !== value)
                                                : [...prev, value]
                                        );
                                        setValue(name, val)
                                    }}
                                >
                                    {label}</button>
                            ))}
                        </div>
                    </div>}
            </div>
            <div className={styles.errorBody}>
                <span className={styles.error}>{error?.message}</span>
            </div>
        </div>
    )
}