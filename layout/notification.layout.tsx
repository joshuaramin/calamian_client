import Header from '@/components/header/header'
import React, { ReactNode } from 'react'

export default function NotificationLayout({ children }: { children: ReactNode }) {
    return (
        <div>
            <Header />
            {children}

        </div>
    )
}
