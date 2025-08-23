import React, { useState } from 'react'
import { Oxygen } from 'next/font/google'
import styles from '@/styles/dashboard/finance/expense.module.scss'
import { format } from 'date-fns'
import UpdateExpensed from './update'

const oxygen = Oxygen({
    weight: "400",
    subsets: ["latin"]
})


export default function ExpenseQuery({ expenseFolderID, expenseID, expense, amount, mod, payDate, onChangeCheckedValue, checked }: { expenseID: string, expense: string, amount: number, payDate: string, mod: string, onChangeCheckedValue: any, checked: any, expenseFolderID: any }) {
    const [updateExpense, setUpdateExpense] = useState(false)
    const onHandleEvent = () => {
        setUpdateExpense(() => !updateExpense)
    }
    const handleClick = (event: any) => {
        if (event.detail === 1) {
            onHandleEvent()
        }
    }
    const formatCurrency = (amount: number) => {
        return Intl.NumberFormat("en-PH", { currency: "PHP", style: "currency" }).format(amount)
    }
    return (
        <tr>

            <td >
                {
                    updateExpense ? <div className={styles.overlay}>
                        <UpdateExpensed expense={expense} amount={amount} mod={mod} payDate={payDate} expenseID={expenseID} close={onHandleEvent} expenseFolderID={expenseFolderID} />
                    </div> : null
                }
                <input type="checkbox" checked={checked} value={expenseID} onChange={onChangeCheckedValue} />
            </td>
            <td onClick={handleClick} className={oxygen.className}>
                {format(new Date(payDate), "MMMM dd, yyyy")}

            </td>
            <td onClick={handleClick} className={oxygen.className}>
                {expense}
            </td>
            <td onClick={handleClick} className={oxygen.className}>
                {formatCurrency(amount)}
            </td>
            <td onClick={handleClick} className={oxygen.className}>
                {mod}
            </td>
        </tr>
    )
}
