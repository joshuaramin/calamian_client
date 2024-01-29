
import React, { useState } from 'react'
import { format } from 'date-fns'
import { Oxygen } from 'next/font/google'

const oxygen = Oxygen({
    weight: "400",
    display: "auto",
    subsets: [ "latin" ]
})

export default function Time() {
    const [ year ] = useState(format(new Date(), "dd MMM, yyyy"))
    return (
        <span className={oxygen.className}>{year}</span>
    )
}
