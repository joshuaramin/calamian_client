"use client"

import React from 'react'
import { ColorRing } from 'react-loader-spinner'


interface SpinnerProps {
    heigth: number
    width: number
}

export default function Spinner({ heigth, width }: SpinnerProps) {
    return (
        <div>
            {/* <ColorRing
                colors={["#244173", "#244173", "#244173", "#244173", "#244173"]}
                width={width}
                height={heigth}
            /> */}
        </div>
    )
}
