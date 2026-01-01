import React, { useState } from 'react'
import { TbDownload, TbBox, TbWallet, TbShoppingBag } from 'react-icons/tb'
import { useQuery } from '@apollo/client/react'
import { GetTotalOrderHistoryFiltered, GetTotal } from '@/lib/apollo/order/order.query'
import {
    Chart as ChartJS,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    ArcElement
} from "chart.js";
import { Bar } from 'react-chartjs-2'
import { DateFilter } from '@/lib/util/dateFilter'
import Exports from './export/export'
import styles from './headAnalytics.module.scss'
import { oxygen, poppins } from '@/lib/typography'
import Spinner from '@/components/spinner'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    ArcElement,
    Legend
)

// -------------------- TYPES --------------------
interface OrderHistory {
    date: string
    total: number
}

interface TotalData {
    getTotal: {
        totalRevenue: number
        totalItems: number
        totalOrders: number
    }
}

interface OrderHistoryData {
    getAllOrderHistory: OrderHistory[]
}

// -------------------- COMPONENT --------------------
export default function HeadAnalytics() {
    const [dateToggle, setDateToggle] = useState(false)
    const [dateFiltering, setDateFiltering] = useState<"Daily" | "Weekly" | "Monthly">("Weekly")
    const [exports, setExports] = useState(false)

    const { loading, data } = useQuery<OrderHistoryData>(GetTotalOrderHistoryFiltered, {
        variables: { dmy: dateFiltering },
        errorPolicy: "all",
    })

    const { loading: totalLoading, data: totalData } = useQuery<TotalData>(GetTotal)

    const onHandleExport = () => setExports(prev => !prev)

    // Prepare chart data
    const chartData = {
        datasets: [
            {
                label: "Revenue",
                borderColor: "#244173",
                backgroundColor: "#244173",
                data: !loading && data
                    ? data.getAllOrderHistory.map(({ date, total }) => ({ x: date, y: total }))
                    : []
            }
        ]
    }

    return (
        <div className={styles.container}>
            {exports && <div className={styles.overlay}><Exports close={onHandleExport} /></div>}

            <div className={styles.main}>
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
                        {/* TOTAL STATS */}
                        <div className={styles.revenue}>
                            {[{
                                icon: <TbWallet size={35} />,
                                label: "Total Profit",
                                value: totalData?.getTotal.totalRevenue,
                                isCurrency: true
                            }, {
                                icon: <TbBox size={35} />,
                                label: "Total No. Of Items",
                                value: totalData?.getTotal.totalItems
                            }, {
                                icon: <TbShoppingBag size={35} />,
                                label: "Total No. Orders",
                                value: totalData?.getTotal.totalOrders
                            }].map((item, idx) => (
                                <div key={idx} className={styles.profit}>
                                    <div className={styles.body1}>
                                        {item.icon}
                                        <div className={styles.body2}>
                                            <h2 className={poppins.className}>{item.label}</h2>
                                            {totalLoading ? (
                                                <Spinner heigth={35} width={35} />
                                            ) : (
                                                <span className={oxygen.className}>
                                                    {item.isCurrency
                                                        ? Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(item.value || 0)
                                                        : item.value}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {idx < 2 && <hr />}
                                </div>
                            ))}
                        </div>

                        {/* CHART */}
                        <div className={styles.charts}>
                            <div className={styles.chart1}>
                                <div className={styles.selection}>
                                    <div
                                        style={dateToggle ? { backgroundColor: "#244173", color: "#fff" } : {}}
                                        className={styles.select}
                                        onClick={() => setDateToggle(prev => !prev)}
                                    >
                                        <span className={oxygen.className}>{dateFiltering}</span>
                                    </div>
                                    {dateToggle && (
                                        <div className={styles.options}>
                                            {DateFilter.map(({ name, value }) => (
                                                <button
                                                    key={name}
                                                    value={value}
                                                    onClick={(e) => {
                                                        setDateFiltering(e.currentTarget.value as any)
                                                        setDateToggle(false)
                                                    }}
                                                >
                                                    {name}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className={styles.line}>
                                    <Bar
                                        datasetIdKey="id"
                                        options={{
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: {
                                                    align: "start",
                                                    position: "bottom",
                                                    labels: { usePointStyle: true }
                                                }
                                            }
                                        }}
                                        data={chartData}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
