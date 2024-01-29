"use client"
import React, { useState, useEffect } from 'react'
import styles from "./imageBackground.module.scss"
import Image from 'next/image'

export default function LoginImage() {
    const [ carousel, setCarousel ] = useState(1)



    useEffect(() => {
        const interval = setInterval(() => {
            setCarousel(() => + carousel + 1);
            if (carousel === 3) {
                return setCarousel(() => 1)
            }
        }, 6000)

        return () => clearInterval(interval)
    }, [ carousel ])


    return (
        <div className={styles.container}>
            <div className={styles.carousel}>
                {
                    carousel === 1 ?
                        <div className={styles.car}>
                            <Image src="/images/Blood test-cuate.png" alt="" height={300} width={300} />
                            <span>
                                Pharmacists play a vital role in medication dispensing, ensuring that patients receive the correct prescription and dosage. They verify the accuracy of prescriptions, provide counseling on proper usage, potential side effects, and interactions, promoting patient safety and effective treatment.
                            </span>
                        </div> : null
                }
                {
                    carousel === 2 ?
                        <div className={styles.car}>
                            <Image src="/images/chemist-amico.png" alt="" height={300} width={300} />
                            <span>
                                In pharmacy practice, medication therapy management involves reviewing a patient{"'"}s medication regimen to optimize its effectiveness and safety. Pharmacists work closely with patients and healthcare providers to identify any potential issues, such as drug interactions or adverse reactions, and make recommendations for adjustments to enhance the patient{"'"}s overall health outcomes.
                            </span>
                        </div> : null
                }
                {
                    carousel === 3 ?
                        <div className={styles.car}>
                            <Image src="/images/Medical research-cuate.png" alt="" height={300} width={300} />
                            <span>
                                Many pharmacies offer immunization services, allowing pharmacists to administer vaccines and contribute to public health initiatives. Pharmacists are trained to provide vaccinations for conditions such as influenza, shingles, and COVID-19. This accessibility helps increase vaccination rates and provides greater convenience for patients seeking preventive care.
                            </span>
                        </div> : null
                }
            </div>
            <div className={styles.indicator}>
                <button onClick={() => setCarousel(() => 1)} className={carousel == 1 ? styles.active : ""}></button>
                <button onClick={() => setCarousel(() => 2)} className={carousel == 2 ? styles.active : ""}></button>
                <button onClick={() => setCarousel(() => 3)} className={carousel == 3 ? styles.active : ""}></button>
            </div>
        </div >
    )
}
