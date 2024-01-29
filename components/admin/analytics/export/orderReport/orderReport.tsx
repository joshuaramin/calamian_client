import React from 'react'
import styles from './orderReport.module.scss'
import { CSVLink } from 'react-csv'
import { format } from 'date-fns'
import { Poppins, Oxygen } from 'next/font/google'
import { TbDownload, TbArrowLeft } from 'react-icons/tb'
const tableHead = [ "Order No.", "No. Of Items", "Total", "Date Order Created" ]


const poppins = Poppins({
    weight: "500",
    subsets: [ "latin" ]
})

const oxygen = Oxygen({
    weight: "400",
    subsets: [ "latin" ]
})

export default function OrderReport({ data, close }: any) {


    const headers = [
        { label: "Order No.", key: "orderNo" },
        { label: "No. of Items", key: "noItems" },
        { label: "Total", key: "total" },
        { label: "Order Created", key: "createdAt" },
    ]
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button onClick={close} className={styles.goback}>
                    <TbArrowLeft size={18} />
                    Go Back</button>
                <CSVLink filename='Calamian MDS Report' className={`${styles.generateBtn} ${poppins.className}`} headers={headers} data={data.generateOrderReport.map(({ orderID, order, createdAt, itemCount, total }: { orderID: string, order: string, createdAt: any, itemCount: number, total: number }) => {
                    return {
                        orderNo: order,
                        noItems: itemCount,
                        total: total,
                        createdAt: format(new Date(createdAt), "MMMM dd, yyyy")
                    }
                })}>
                    <TbDownload size={18} />
                    Download</CSVLink>
            </div>
            <table>
                <thead>
                    <tr>
                        {tableHead.map((name) => (
                            <th className={poppins.className} key={name}>{name}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.generateOrderReport.map(({ orderID, order, createdAt, itemCount, total }: {
                        orderID: string, order: string, createdAt: any, itemCount: number, total: number
                    }) => (
                        <tr key={orderID}>
                            <td className={oxygen.className}>{order}</td>
                            <td className={oxygen.className}>{itemCount}</td>
                            <td className={oxygen.className}>{Intl.NumberFormat("en-US", { style: "currency", currency: "PHP" }).format(total)}</td>
                            <td className={oxygen.className}>{format(new Date(createdAt), "MMMM dd, yyyy")}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className={styles.total}>
                <h2 className={poppins.className}>Total: </h2>
                <span className={oxygen.className}>{Intl.NumberFormat("en-US", { style: "currency", currency: "PHP" }).format(data.generateOrderReport.reduce((a: any, b: any) => (a + b.total), 0))}</span>
            </div>
        </div>
    )
}
