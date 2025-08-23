import React, { FC } from 'react'
import styles from '@/styles/dashboard/admin/administrator.module.scss'
import PageWithLayout from '@/layout/page.layout'
import Dashboard from '@/layout/dashboard.layout'
import Head from 'next/head'
import HeadAnalytics from '@/lib/ui/analytics/headAnalytics'
import OrderAnalytics from '@/lib/ui/analytics/orderAnalytics/orderAnalytics'


const Administrator: FC = () => {
    return (
        <div className={styles.container}>
            <Head>
                <title>Overview</title>
            </Head>
            <HeadAnalytics />
            <OrderAnalytics />
        </div>
    )
}

(Administrator as PageWithLayout).layout = Dashboard

export default Administrator