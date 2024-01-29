import React, { FC, useEffect, useState } from 'react'
import { TbFileTypePdf, TbFileTypeCsv, TbTrash, TbChartBar, TbChartBarOff, TbArrowLeft, TbX, TbCheck } from 'react-icons/tb'
import { Oxygen } from 'next/font/google'
import { useRouter } from 'next/router'
import { client } from '@/lib/apolloWrapper'
import { GetAllExpenseFolder, GetExpenseFolderById, GetAllExpense, GetExpenseByGroup } from '@/lib/util/finance/finance.query'
import { GetStaticPropsContext } from 'next'
import { useMutation, useQuery } from '@apollo/client'
import { CreateExpense } from '@/lib/util/finance/finance.mutation'
import { ExpenseSubscriptions } from '@/lib/util/finance/finance.subscriptions'
import { Chart as ChartJS, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, ArcElement } from "chart.js";
import { Bar } from 'react-chartjs-2'
import { useLocalStorageValue } from '@react-hookz/web'
import styles from '@/styles/dashboard/admin/finance/expense.module.scss'
import DeleteExepenses from '@/components/admin/finance/expenses/delete'
import Head from 'next/head'
import ExpenseQuery from '@/components/admin/finance/expenses/expenseQuery'
import DownloadCSV from '@/components/admin/finance/expenses/csv'
import DownloadPDF from '@/components/admin/finance/expenses/pdf'
import Dashboard from '@/layout/dashboard.layout'
import PageWithLayout from '@/layout/page.layout'

ChartJS.register(CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip, ArcElement,
    Legend);


const oxygen = Oxygen({
    weight: "400",
    subsets: [ "latin" ]
})



export const getStaticPaths = async () => {

    const { data: { getAllExpenseFolder } } = await client.query({
        query: GetAllExpenseFolder
    })

    const paths = getAllExpenseFolder.map(({ expFolderID }: { expFolderID: string }) => {
        return { params: { id: expFolderID } }
    })
    return { paths, fallback: true }
}


export const getStaticProps = async (context: GetStaticPropsContext) => {

    const financeid = context.params?.id

    const { data: { getExpenseFolderById } } = await client.query({
        query: GetExpenseFolderById,
        variables: {
            expFolderId: financeid
        }
    })
    return {
        props: {
            expensed: getExpenseFolderById
        }
    }
}


const Thead = [ "Date", "Descriptions", "Amount", "Mode of Payment" ]
const FinanceID: FC = ({ expensed }: any) => {

    const dataStore = useLocalStorageValue("expenses", { initializeWithValue: false })

    const router = useRouter();

    const onHandleLocalStorageStore = () => {
        dataStore.set(true)
        if (dataStore.value === true) {
            dataStore.set(false)
        }
    }


    const [ addNewExpenses, setNewExpenses ] = useState({
        amount: "" as unknown as number,
        expense: "",
        mod: "",
        payDate: ""
    })

    const [ AddNewExpense ] = useMutation(CreateExpense)

    const { loading, data, subscribeToMore } = useQuery(GetAllExpense, {
        variables: {
            expFolderId: router.query.id
        }
    })

    const { loading: loadingGroup, data: expenseGroup } = useQuery(GetExpenseByGroup, {
        variables: {
            expFolderId: router.query.id
        },
        pollInterval: 1000
    })

    useEffect(() => {
        return subscribeToMore({
            document: ExpenseSubscriptions,
            variables: {
                expFolderId: router.query.id
            },
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev

                const newExpenseAdded = subscriptionData.data.expensesSubscriptions

                console.log(newExpenseAdded)

                return Object.assign({}, {
                    getAllExpense: [ ...prev.getAllExpense, newExpenseAdded ]
                })
            }
        })
    }, [ router.query.id, subscribeToMore ])

    useEffect(() => {

        if (!addNewExpenses.amount || !addNewExpenses.expense || !addNewExpenses.mod || !addNewExpenses.payDate) {
            return
        } else if (addNewExpenses.mod === "-") {
            return
        } else {
            AddNewExpense({
                variables: {
                    expFolderId: router.query.id,
                    expenses: {
                        payDate: addNewExpenses.payDate,
                        mod: addNewExpenses.mod,
                        expense: addNewExpenses.expense,
                        amount: addNewExpenses.amount
                    }
                },
                onCompleted: () => {
                    setNewExpenses({
                        amount: "" as unknown as number,
                        expense: "",
                        mod: "-",
                        payDate: ""
                    })
                }
            })
        }




    }, [ AddNewExpense, addNewExpenses.amount, addNewExpenses.expense, addNewExpenses.mod, addNewExpenses.payDate, router.query.id ])



    const [ CSV, setCSV ] = useState(false)
    const [ PDF, setPDF ] = useState(false)
    const [ deleteList, setDeleteList ] = useState(false)
    const [ selectedAll, setSelectedAll ] = useState(false)
    const [ list, setList ] = useState<string[]>([])

    const onHandlePDFDownload = () => {
        setPDF(() => !PDF)
    }
    const onHandleCSVDownload = () => {
        setCSV(() => !CSV)
    }

    const expenses = data?.getAllExpense

    const toggleExpense = () => {
        setSelectedAll(!selectedAll)
        if (!selectedAll) {
            setList(expenses.map(({ expenseID }: any) => { return expenseID }))
        } else {
            setList([])
        }
    }

    const toggleSelectedExpense = (expenseID: string) => {

        if (list.includes(expenseID)) {
            setList(list.filter(id => id !== expenseID));
        }
        else {
            setList([ ...list, expenseID ]);
        }
    }


    const onHandleDeleteExpense = () => {
        expenses.filter((exp: any) => !list.includes(exp.id))
        setList([])
        setSelectedAll(false)
    }

    const onHandleDeleteToggle = () => {
        setDeleteList(() => !deleteList)
    }

    if (router.isFallback) {
        return (<p>Loading....</p>)
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Expense Tracker</title>
            </Head>
            <div className={styles.header}>
                <div className={styles.option1}>
                    <button onClick={() => router.back()}>
                        <TbArrowLeft size={23} />
                        <span className={oxygen.className}>Go Back</span>
                    </button>
                </div>
                <div className={styles.options2}>
                    <button onClick={onHandlePDFDownload} className={styles.pdf}>
                        <TbFileTypePdf size={25} />
                        <span className={oxygen.className}>PDF Download</span>
                    </button>
                    <button onClick={onHandleCSVDownload} className={styles.excelCSV}>
                        <TbFileTypeCsv size={25} />
                        <span className={oxygen.className}>CSV Download</span>
                    </button>
                    <button onClick={onHandleDeleteToggle} className={styles.deleteBtn}>
                        <TbTrash size={25} />
                        <span className={oxygen.className}>Delete({list.length}) </span>
                    </button>
                    <button className={styles.chart} onClick={onHandleLocalStorageStore} >
                        {dataStore.value ? <TbChartBarOff size={25} /> : <TbChartBar size={25} />}
                        <span className={oxygen.className}>Chart</span>
                    </button>
                </div>
            </div>
            {
                PDF ? <div className={styles.overlay}>
                    <DownloadPDF data={data} filenamed={expensed[ 0 ].exFolder} close={onHandlePDFDownload} />
                </div> : null
            }
            {
                CSV ? <div className={styles.overlay}>
                    <DownloadCSV close={onHandleCSVDownload} filenamed={expensed[ 0 ].exFolder} data={data} />
                </div> : null
            }
            {
                deleteList ? <div className={styles.overlay}>
                    <DeleteExepenses close={onHandleDeleteToggle} items={list.length} data={list} folderId={router.query.id} deleted={onHandleDeleteExpense} />
                </div> : null
            }
            {dataStore.value ? <div className={styles.chartHeader}>
                <div>
                    <Bar
                        options={{
                            maintainAspectRatio: false,
                            scales: {
                                x: {
                                    display: false,
                                    ticks: {
                                        autoSkip: false,
                                        maxRotation: 24,
                                        minRotation: 24
                                    }
                                }
                            },
                            plugins: {
                                legend: {
                                    display: false
                                },

                            }
                        }}
                        data={{
                            datasets: [ {
                                barPercentage: 1,
                                borderSkipped: "start",
                                inflateAmount: "auto",
                                backgroundColor: function getRandomLightColor() {
                                    var minBrightness = 200;
                                    var r, g, b;

                                    do {
                                        r = Math.floor(Math.random() * 255);
                                        g = Math.floor(Math.random() * 255);
                                        b = Math.floor(Math.random() * 255);
                                    } while ((r + g + b) < minBrightness);

                                    return "rgba(" + r + "," + g + "," + b + ", 0.8)";
                                },
                                data: loadingGroup ? "" : expenseGroup.getAllExpenseByGroup.map(({ expense, amount }: { expense: string, amount: number }) => {
                                    return {
                                        x: expense, y: amount
                                    }
                                })
                            } ]
                        }}
                    />
                </div>
            </div> : null}

            <table>
                <thead>
                    <tr>
                        <th>
                            <input type="checkbox" onChange={toggleExpense} checked={selectedAll} />
                        </th>
                        {Thead.map((name) => (
                            <th className={oxygen.className} key={name}>{name}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>

                        </td>
                        <td className={oxygen.className}>
                            <input type="date" value={addNewExpenses.payDate} onChange={(e) => setNewExpenses({ ...addNewExpenses, payDate: e.target.value })} />
                        </td>
                        <td className={oxygen.className}>
                            <input className={oxygen.className} type="text" value={addNewExpenses.expense} placeholder='Descriptions' onChange={(e) => setNewExpenses({ ...addNewExpenses, expense: e.target.value })} />
                        </td>
                        <td>
                            <input className={oxygen.className} type="text" placeholder='Amount' value={addNewExpenses.amount} onChange={(e) => {
                                setNewExpenses({ ...addNewExpenses, amount: parseInt(e.target.value) })
                                if (isNaN(parseInt(e.target.value))) {
                                    setNewExpenses({ ...addNewExpenses, amount: "" as unknown as number })
                                }

                            }} />
                        </td>
                        <td>
                            <select value={addNewExpenses.mod} onChange={(e) => setNewExpenses({ ...addNewExpenses, mod: e.target.value })}>
                                <option className={oxygen.className} value="-">Please Select</option>
                                <option className={oxygen.className} value="Cash">Cash</option>
                                <option className={oxygen.className} value="Card">Card</option>
                                <option className={oxygen.className} value="Paypal">Paypal</option>
                            </select>
                        </td>
                    </tr>
                    {loading ? "" : data.getAllExpense.map(({ expenseID, expense, amount, mod, payDate }:
                        { expenseID: string, expense: string, amount: number, mod: string, payDate: string }) => (
                        <ExpenseQuery
                            key={expenseID}
                            expenseID={expenseID}
                            expense={expense}
                            amount={amount}
                            mod={mod}
                            payDate={payDate}
                            checked={list.includes(expenseID)}
                            onChangeCheckedValue={() => toggleSelectedExpense(expenseID)}
                            expenseFolderID={router.query.id}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    )
}


(FinanceID as PageWithLayout).layout = Dashboard
export default FinanceID