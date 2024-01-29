import React, { useEffect, useState } from 'react'
import styles from './pdf.module.scss'
import { Poppins } from 'next/font/google'
import { PDFDownloadLink } from '@react-pdf/renderer'

import { Document, View, Page, StyleSheet, Text } from '@react-pdf/renderer'

const poppins = Poppins({
    weight: "400",
    subsets: [ "latin" ]
})

const styleses = StyleSheet.create({
    body: {
        padding: "10px"
    },
    header: {
        width: "100%",
        height: "100px",
        padding: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    headerText: {
        fontSize: 15,
    },
    totalContianer: {
        width: "100%",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        height: "25px",
        borderBottom: "1px",
        padding: "0 10px"
    },
    totalText: {
        fontSize: 10,
    },
    table: {
        display: "flex",
        width: "auto",
        borderStyle: "solid",
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0
    },
    tableRow: {
        margin: "auto",
        flexDirection: "row"
    },
    tableCol: {
        width: "25%",
        height: "25px",
        borderStyle: "solid",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0
    },
    tableCell: {
        margin: "auto",
        marginTop: 5,
        fontSize: 10
    }
})
const PDF = ({ data }: any) => {
    return (
        <Document>
            <Page size={"LETTER"} style={styleses.body}>
                <View style={styleses.header}>
                    <Text style={styleses.headerText}>Calamian MDs Pharmacy</Text>
                    <Text style={styleses.headerText}>Ventura{"'"}s Residence, Salvacion, Busuanga, Palawan, Philippines</Text>
                </View>

                <View style={styleses.table}>
                    <View style={styleses.tableRow}>
                        <View style={styleses.tableCol}>
                            <Text style={styleses.tableCell}>Date of Payment</Text>
                        </View>
                        <View style={styleses.tableCol}>
                            <Text style={styleses.tableCell}>Descriptions</Text>
                        </View>
                        <View style={styleses.tableCol}>
                            <Text style={styleses.tableCell}>Amount</Text>
                        </View>
                        <View style={styleses.tableCol}>
                            <Text style={styleses.tableCell}>Mode of Payment</Text>
                        </View>
                    </View>

                    {data.getAllExpense.map(({ expense, amount, mod, payDate, expenseID }: { expense: string, amount: number, mod: string, payDate: any, expenseID: string }) => (
                        <View key={expenseID} style={styleses.tableRow}>
                            <View style={styleses.tableCol}>
                                <Text style={styleses.tableCell}>{payDate}</Text>
                            </View>
                            <View style={styleses.tableCol}>
                                <Text style={styleses.tableCell}>{expense}</Text>
                            </View>
                            <View style={styleses.tableCol}>
                                <Text style={styleses.tableCell}>PHP {amount}</Text>
                            </View>
                            <View style={styleses.tableCol}>
                                <Text style={styleses.tableCell}>{mod}</Text>
                            </View>
                        </View>
                    ))}
                </View>
                <View style={styleses.totalContianer}>
                    <Text style={styleses.totalText}>Total: PHP {data.getAllExpense.reduce((a: any, b: any) => (a + b.amount), 0)}</Text>
                </View>
            </Page>
        </Document>

    )
}
export default function DownloadPDF({ close, filenamed, data }: { close: () => void, filenamed: string, data: any }) {

    const [ isClient, setIsClient ] = useState(false)


    useEffect(() => {
        setIsClient(true)
    }, [])
    return (
        <div className={styles.container}>
            <h2 className={poppins.className}>Do you want to Download as PDF?</h2>
            <div className={styles.form}>
                <div className={styles.addBtnGrp}>
                    <button onClick={close} type="button">Cancel</button>
                    {isClient ? <PDFDownloadLink fileName={filenamed} style={{ width: "100%" }} className={poppins.className} document={<PDF data={data} />}>
                        <button style={{ width: "100%", height: "45px", backgroundColor: "#244173", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>Download</button>
                    </PDFDownloadLink> : null}
                </div>
            </div>
        </div>
    )
}
