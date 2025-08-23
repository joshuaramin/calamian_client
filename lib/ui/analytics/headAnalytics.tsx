import React, { useState } from 'react'
import { Poppins, Oxygen } from 'next/font/google'
import { TbDownload, TbBox, TbWallet, TbShoppingBag } from 'react-icons/tb'
import { useQuery } from '@apollo/client'
import { GetAllTotalRevenue, GetTotalOrders, GetTotalOrderHistoryFiltered } from '@/lib/apollo/order/order.query'
import { GetTotalOfNumberItems } from '@/lib/apollo/Items/item.query'
import { Chart as ChartJS, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, ArcElement } from "chart.js";
import { Bar } from 'react-chartjs-2'
import { DateFilter } from '@/lib/util/dateFilter'
import Exports from './export/export'
import styles from './headAnalytics.module.scss'

ChartJS.register(CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip, ArcElement,
    BarElement,
    Legend);
const poppins = Poppins({
    weight: "600",
    subsets: ["latin"]
})


const oxygen = Oxygen({
    weight: "400",
    subsets: ["latin"]
})



export default function HeadAnalytics() {


    const [dateToggle, setDateToggle] = useState(false)
    const [dateFiltering, setDateFiltering] = useState("Weekly")
    const [exports, setExports] = useState(false)


    const onHandleExport = () => {
        setExports(() => !exports)
    }
    const { loading, data } = useQuery(GetTotalOrderHistoryFiltered, {
        variables: {
            dmy: dateFiltering,
        },
        errorPolicy: "all",
        onError: (error) => {
            alert(error.message)
        }
    })
    const { loading: totalRevenueLoading, data: totalRevenue } = useQuery(GetAllTotalRevenue)
    const { loading: totalOrdersLoading, data: totalOrders } = useQuery(GetTotalOrders)
    const { loading: totalItemsLoading, data: totalItems } = useQuery(GetTotalOfNumberItems)
    return (

        <div className={styles.container}>
            <div className={styles.main}>
                {
                    exports ? <div className={styles.overlay}>
                        <Exports close={onHandleExport} />
                    </div> : null
                }
                <div className={styles.boxHeader}>
                    <div className={styles.dateExport}>
                        <button onClick={onHandleExport} className={styles.export}>
                            <TbDownload size={20} />
                            <span className={oxygen.className}>Export Report</span>
                        </button>
                    </div>
                </div>
                <div className={styles.otherBox}>
                    <div className={styles.box1}>

                        <div className={styles.revenue}>
                            <div className={styles.rev}>
                                <div className={styles.profit}>
                                    <div className={styles.body1}>
                                        <TbWallet size={35} />
                                        <div className={styles.body2}>
                                            <h2 className={poppins.className}>Total Profit</h2>
                                            {totalRevenueLoading ? "" : <span className={oxygen.className}>{totalRevenue.getTotalRevenue.toString().length === 5 ?
                                                Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(totalRevenue.getTotalRevenue) : Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", notation: "standard" }).format(totalRevenue.getTotalRevenue)

                                            }</span>}
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                <div className={styles.profit}>
                                    <div className={styles.body1}>
                                        <TbBox size={35} />
                                        <div className={styles.body2}>
                                            <h2 className={poppins.className}>Total No. Of Items</h2>
                                            <span className={oxygen.className}>{totalItemsLoading ? "" : totalItems.getTotalNoOfItems}</span>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                <div className={styles.profit}>
                                    <div className={styles.body1}>
                                        <TbShoppingBag size={35} />
                                        <div className={styles.body2}>
                                            <h2 className={poppins.className}>Total No. Orders</h2>
                                            <span className={oxygen.className}>{totalOrdersLoading ? "" : totalOrders.getTotalNoOfOrders
                                            }</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className={styles.charts}>
                            <div className={styles.chart1}>
                                <div className={styles.selection}>
                                    <div style={dateToggle ? { backgroundColor: "#244173", color: "#fff" } : {}} onClick={() => setDateToggle(() => !dateToggle)} className={styles.select}>
                                        <span className={oxygen.className}>{dateFiltering}</span>
                                    </div>
                                    {dateToggle ? <div className={styles.options}>
                                        {DateFilter.map(({ name, value }) => (
                                            <button onClick={(e) => {
                                                setDateFiltering(e.currentTarget.value)
                                                setDateToggle(false)
                                            }} key={name} value={value}>{name}</button>
                                        ))}
                                    </div> : null}
                                </div>
                                <div className={styles.line}>
                                    <Bar
                                        datasetIdKey='id'
                                        options={{
                                            maintainAspectRatio: false,
                                            backgroundColor: "#244173",

                                            plugins: {
                                                legend: {
                                                    align: "start",
                                                    position: "bottom",
                                                    labels: {
                                                        usePointStyle: true
                                                    }
                                                }
                                            }
                                        }}
                                        data={{
                                            datasets: [
                                                {
                                                    label: "Revenue",
                                                    borderColor: "#244173",
                                                    backgroundColor: "#244173",
                                                    data: loading ? "" : data.getAllOrderHistory.map(({ date, total }: {
                                                        date: any, total: number
                                                    }) => {
                                                        return { x: date, y: total }
                                                    })
                                                }
                                            ]
                                        }}
                                    /></div>
                            </div>
                        </div>
                    </div>


                </div>
            </div >
        </div>
    )
}
