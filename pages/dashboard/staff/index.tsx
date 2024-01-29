import React from 'react'
import Orders from '@/components/staff/orders/order'
import Menu from '@/components/staff/menu/menu'
import styles from '@/styles/dashboard/staff/page.module.scss'

export default function Staff() {
  return (
    <div className={styles.container}>
      <Menu />
      <Orders />
    </div>
  )
}
