import React from 'react'
import styles from './csv.module.scss'
import { Poppins } from 'next/font/google'
import { format } from 'date-fns'
import { CSVLink } from 'react-csv'

const poppins = Poppins({
    weight: "400",
    subsets: [ "latin" ]
})

const headers = [
    { label: "Date", key: "date" },
    { label: "Descriptions", key: "descriptions" },
    { label: "Amount", key: "amount" },
    { label: "Mode of Payment", key: "mop" }
]

export default function DownloadCSV({ close, filenamed, data }: { close: () => void, filenamed: string, data: any }) {


    return (
        <div className={styles.container}>
            <h2 className={poppins.className}>Do you want to Download as CSV</h2>
            <div className={styles.form}>
                <div className={styles.addBtnGrp}>
                    <button onClick={close} type="button">Cancel</button>
                    <CSVLink filename={filenamed} style={{ width: "100%", height: "50px", backgroundColor: "#244173" }} data={data.getAllExpense.map(({ expense, mod, payDate, amount }: { expense: string, mod: string, payDate: any, amount: number }) => {
                        return {
                            descriptions: expense,
                            mop: mod,
                            date: format(new Date(payDate), "MMM dd, yyyy"),
                            amount: Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(amount)
                        }
                    })} headers={headers}  >
                        <button type="submit" className={`${poppins.className} ${styles.addBtn}`}>Yes, Download</button>
                    </CSVLink>
                </div>
            </div>
        </div >
    )
}
