import React, { SyntheticEvent, useEffect, useState } from 'react'
import styles from './edit.module.scss'
import { TbX } from 'react-icons/tb'
import { Oxygen } from 'next/font/google'
import { useMutation } from '@apollo/client'
import { UpdateUserAccounts } from '@/lib/util/User/user.mutation'
import { getAllUserQuery } from '@/lib/util/User/user.query'
import Message from '@/components/message/message'


const oxygen = Oxygen({
    weight: "400",
    subsets: [ "latin" ]
})

export default function UserEdit({ close, userID, email, phone, salary, fullname, firstname, lastname, birthday }: any) {


    const [ UUA, { data } ] = useMutation(UpdateUserAccounts)
    const [ message, setMessage ] = useState<Boolean>(false)


    const [ uua, setUUA ] = useState({
        email: email,
        firstname: firstname,
        lastname: lastname,
        phone: phone,
        salary: salary,
        birthday: birthday
    })

    const onHandleUpdateaccount = (e: SyntheticEvent) => {
        e.preventDefault();
        UUA({
            variables: {
                userId: userID,
                user: {
                    birthday: uua.birthday,
                    email: uua.email,
                    firstname: uua.firstname,
                    lastname: uua.lastname,
                    phone: uua.phone,
                    salary: uua.salary
                }
            },
            onCompleted: () => {
                setMessage(true)
            },
            refetchQueries: [ getAllUserQuery ]
        })
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setMessage(false)
        }, 2000);


        return () => clearInterval(interval)
    }, [ message ])



    return (
        <div className={styles.container}>
            {data && message == true ? <Message msg="Successfully Updated" /> : null}
            <div className={styles.editHeader}>
                <h2 className={oxygen.className}>Edit User</h2>
                <button onClick={close}>
                    <TbX size={23} />
                </button>
            </div>
            <form onSubmit={onHandleUpdateaccount}>
                <div className={styles.ss}>
                    <div>
                        <label className={oxygen.className}>Email Address</label>
                        <input className={styles.inp} type="text" onChange={(e) => setUUA({ ...uua, email: e.target.value })} value={uua.email} />
                    </div>
                    <div>
                        <label className={oxygen.className}>Phone</label>
                        <input className={styles.inp} type="text" onChange={(e) => setUUA({ ...uua, phone: e.target.value })} value={uua.phone} />
                    </div>
                    <div>
                        <label className={oxygen.className}>Firstname</label>
                        <input className={styles.inp} type="text" onChange={(e) => setUUA({ ...uua, firstname: e.target.value })} value={uua.firstname} />
                    </div>
                    <div>
                        <label className={oxygen.className}>Lastname</label>
                        <input className={styles.inp} type="text" onChange={(e) => setUUA({ ...uua, lastname: e.target.value })} value={uua.lastname} />
                    </div>
                    <div>
                        <label className={oxygen.className}>Salary</label>
                        <input className={styles.inp} type="text" onChange={(e) => setUUA({ ...uua, salary: parseFloat(e.target.value) })} value={uua.salary} />
                    </div>
                    <div>
                        <label className={oxygen.className}>Birthday</label>
                        <input className={styles.inp} type="date" onChange={(e) => setUUA({ ...uua, birthday: e.target.value })} value={uua.birthday} />
                    </div>

                </div>
                <div className={styles.addBtnGrp}>
                    <button type="submit" className={styles.addBtn}>
                        <span>Submit</span>
                    </button>
                </div>

            </form>

        </div>
    )
}
