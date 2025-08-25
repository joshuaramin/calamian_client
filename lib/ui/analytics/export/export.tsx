import React, { SyntheticEvent, useState } from 'react'
import styles from './export.module.scss'
import { TbDownload, TbX } from 'react-icons/tb'
import { Poppins, Oxygen } from 'next/font/google'
import { useMutation } from '@apollo/client'
import OrderReport from './orderReport/orderReport'
import { ReportOrders } from '@/lib/apollo/order/order.mutation'
import Message from '@/components/message/message'
import toast from 'react-hot-toast'
import ToastNotification from '@/components/toastNotification'
const poppins = Poppins({
    weight: "500",
    subsets: ["latin"]
})

const oxygen = Oxygen({
    weight: "400",
    subsets: ["latin"]
})
export default function Export({ close }: { close: () => void }) {

    const [report, setReport] = useState(false)

    const [dates, setDates] = useState({
        startDate: "",
        endDate: ""
    })
    const [ReportMutation, { data }] = useMutation(ReportOrders)

    const onHandleGeneratedReports = () => {
        setReport(() => !report)
    }

    const onSubmitOrderReport = (e: SyntheticEvent) => {
        e.preventDefault();
        ReportMutation({
            variables: {
                startDate: dates.startDate,
                endDate: dates.endDate
            },
            onCompleted: () => {
                toast.success("Successffully Exported")
                setReport(true)
            }
        })
    }


    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={poppins.className}>Generate Report</h2>
                <button onClick={close}>
                    <TbX size={23} />
                </button>
            </div>
            {
                report ? <div className={styles.overlay}>
                    <OrderReport data={data} close={onHandleGeneratedReports} />
                </div> : null
            }
            <form onSubmit={onSubmitOrderReport}>
                <div>
                    <label className={oxygen.className}>Start Date</label>
                    <input type="date" value={dates.startDate} onChange={(e) => setDates({ ...dates, startDate: e.target.value })} />
                </div>
                <div>
                    <label className={oxygen.className}>End Date</label>
                    <input type="date" value={dates.endDate} onChange={(e) => setDates({ ...dates, endDate: e.target.value })} />
                </div>
                <button type="submit">
                    <TbDownload size={20} />
                    <span className={oxygen.className}>Generate Report</span>
                </button>
            </form>
            <ToastNotification />
        </div>
    )
}
