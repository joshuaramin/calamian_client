import React, { useState, SyntheticEvent, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { CreateUser } from '@/lib/apollo/User/user.mutation';
import styles from '@/styles/dashboard/users/add.module.scss';
import { TbChevronUp, TbChevronDown } from 'react-icons/tb';
import { Poppins, Oxygen, } from 'next/font/google';
import Message from '@/components/message/message';


const poppins = Poppins({
    weight: "400",
    subsets: ["latin"]
})

const oxygen = Oxygen({
    weight: "400",
    subsets: ["latin"]
})
const userRoles = [
    { name: "Administator", value: "admin" },
    { name: "Manager", value: "manager" },
    { name: "Staff", value: "staff" }
]


interface User {
    email: string
    firstname: string
    lastname: string
    birthday: string
    role: string
    phone: string
    salary: number
}

export default function AddUser({ close }: any) {

    const [role, setRoles] = useState(false)
    const [message, setMessage] = useState<Boolean>(false)

    const [users, setUsers] = useState<User>({
        "email": "",
        "firstname": "",
        "lastname": "",
        "phone": "",
        "birthday": "",
        "role": "",
        "salary": "" as unknown as number
    })


    const [userMutate, { data }] = useMutation(CreateUser)

    const onUserFormSubmit = (e: SyntheticEvent) => {
        e.preventDefault();
        userMutate({
            variables: {
                role: users.role,
                user: {
                    email: users.email,
                    firstname: users.firstname,
                    lastname: users.lastname,
                    phone: users.phone,
                    birthday: users.birthday,
                    salary: users.salary
                }
            },
            errorPolicy: "all",
            onCompleted: () => {
                setMessage(true)
                setUsers({
                    "email": "",
                    "firstname": "",
                    "lastname": "",
                    "phone": "",
                    "birthday": "",
                    "role": "",
                    "salary": "" as unknown as number
                })
            },

        })
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setMessage(false)
        }, 2000);


        return () => clearInterval(interval)
    }, [message])

    return (
        <div className={styles.container}>
            {data && message === true ? <Message msg="Successfully Added" /> : null}
            <h2 className={poppins.className}>Add User </h2>
            <form onSubmit={onUserFormSubmit}>
                <input value={users.email} className={styles.inp} type="email" placeholder='Email Address' onChange={(e) => setUsers({ ...users, email: e.target.value })} />
                <div>
                    <input value={users.firstname} className={styles.inp} type="text" placeholder='Firstname' onChange={(e) => setUsers({ ...users, firstname: e.target.value })} />
                    <input value={users.lastname} className={styles.inp} type="text" placeholder='Lastname' onChange={(e) => setUsers({ ...users, lastname: e.target.value })} />
                </div>
                <input value={users.phone} className={styles.inp} type="text" placeholder='Phone' onChange={(e) => setUsers({ ...users, phone: e.target.value })} />
                <label className={oxygen.className}>Birthday</label>
                <input value={users.birthday} className={styles.inp} type="date" onChange={(e) => setUsers({ ...users, birthday: e.target.value })} />
                <input value={users.salary} className={styles.inp} type="text" placeholder='Salary' onChange={(e) => {
                    setUsers({ ...users, salary: parseFloat(e.target.value) })
                    if (isNaN(parseInt(e.target.value))) {
                        setUsers({ ...users, salary: "" as unknown as number })
                    }
                }} />
                <div className={styles.selection}>
                    <div onClick={() => setRoles(() => !role)} className={styles.select}>
                        <span className={oxygen.className}>Select Role: {users.role} </span>
                        {role ? <TbChevronUp /> : <TbChevronDown />}
                    </div>
                    {role ? <div className={styles.options}>
                        {userRoles.map(({ name, value }) => (
                            <button onClick={(e) => {
                                setUsers({ ...users, role: e.currentTarget.value })
                                if (users.role === value) {
                                    setUsers({ ...users, role: "" })
                                }
                                setRoles(false)
                            }} className={value === users.role ? `${styles.active}` : `${styles.notactive}`} type="button" key={name} value={value}>{name}</button>
                        ))}
                    </div> : null}
                </div>
                <div className={styles.addBtnGrp}>
                    <button onClick={close} type="button" className={`${styles.cancelBtn} ${poppins.className}`}>Cancel</button>
                    <button type="submit" className={`${styles.addBtn} ${poppins.className}`}>Submit </button>
                </div>

            </form>
        </div>
    )
}
