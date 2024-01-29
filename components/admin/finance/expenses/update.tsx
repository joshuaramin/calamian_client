import React, { SyntheticEvent, useState } from 'react'
import { Oxygen, Poppins } from 'next/font/google'
import { useMutation } from '@apollo/client'
import { UpdateExpense } from '@/lib/util/finance/finance.mutation'
import { GetAllExpense } from '@/lib/util/finance/finance.query'
import styles from './update.module.scss'

const oxygen = Oxygen({
    weight: "400",
    subsets: [ "latin" ]
})

const poppins = Poppins({
    weight: "500",
    subsets: [ "latin" ]
})
export default function UpdateExpensed({ expenseID, expense, amount, mod, payDate, close, expenseFolderID }: { expenseID: string, expense: string, amount: number, mod: string, payDate: any, close: () => void, expenseFolderID: string }) {

    const [ updateNewExpenses, setUpdateNewExpenses ] = useState({
        expense: expense,
        amount: amount,
        mod: mod,
        payDate: payDate

    })


    const [ UpdateExpenses ] = useMutation(UpdateExpense, {
        variables: {
            expenseId: expenseID,
            expenses: {
                expense: updateNewExpenses.expense,
                mod: updateNewExpenses.mod,
                payDate: updateNewExpenses.payDate,
                amount: updateNewExpenses.amount
            }
        },
        onCompleted: () => {
            alert("Successfully Updated")
        },
        refetchQueries: [ {
            query: GetAllExpense, variables: {
                expFolderId: expenseFolderID
            }
        } ]
    })



    const onHandleSubmitForm = (e: SyntheticEvent) => {
        e.preventDefault();
        UpdateExpenses()
    }
    return (
        <div className={styles.container}>
            <h2 className={poppins.className}>Expense Update</h2>
            <form onSubmit={onHandleSubmitForm}>
                <input type="date" value={updateNewExpenses.payDate} onChange={(e) => setUpdateNewExpenses({ ...updateNewExpenses, payDate: e.target.value })} />
                <input type="text" value={updateNewExpenses.expense} onChange={(e) => setUpdateNewExpenses({ ...updateNewExpenses, expense: e.target.value })} />
                <input type="text" value={updateNewExpenses.amount} onChange={(e) => {
                    setUpdateNewExpenses({ ...updateNewExpenses, amount: parseFloat(e.target.value) })
                    if (isNaN(parseFloat(e.target.value))) {
                        setUpdateNewExpenses({ ...updateNewExpenses, amount: "" as unknown as number })
                    }
                }} />
                <select value={updateNewExpenses.mod} onChange={(e) => setUpdateNewExpenses({ ...updateNewExpenses, mod: e.target.value })}>
                    <option className={oxygen.className} value="-">Please Select</option>
                    <option className={oxygen.className} value="Cash">Cash</option>
                    <option className={oxygen.className} value="Card">Card</option>
                    <option className={oxygen.className} value="Paypal">Paypal</option>
                </select>
                <div className={styles.addBtnGrp}>
                    <button onClick={close} type="button">Cancel</button>
                    <button className={styles.addBtn} type="submit">Yes, Change it</button>
                </div>
            </form>
        </div>
    )
}
