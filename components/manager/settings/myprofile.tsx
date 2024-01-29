import React, { useState, useEffect, SyntheticEvent } from 'react'
import styles from './myprofile.module.scss'
import { Poppins } from 'next/font/google'
import { ProfileByUserId } from '@/lib/util/User/profile/profile.query'
import { useMutation, useQuery } from '@apollo/client'
import { ProfileUpdate } from '@/lib/util/User/profile/profile.mutation'

const poppins = Poppins({
    weight: '500',
    subsets: [ "latin" ]
})
export default function MyProfile({ userID }: any) {



    const [ profile, setProfile ] = useState({
        firstname: "",
        lastname: "",
        phone: "",
        birthday: ""
    })

    const { loading, data } = useQuery(ProfileByUserId, {
        variables: {
            userId: userID
        }
    })
    useEffect(() => {
        data.getProfileByUserId.map(({ firstname, lastname, birthday, phone }: any) => {
            setProfile({
                birthday,
                firstname,
                lastname, phone
            })
        })
    }, [ data ])



    const [ mutate ] = useMutation(ProfileUpdate)

    const ProfileSubmitForm = (e: SyntheticEvent) => {
        e.preventDefault();
        mutate({
            variables: {
                userId: userID,
                firstname: profile.firstname,
                lastname: profile.lastname,
                phone: profile.phone,
                birthday: profile.birthday
            },
            onCompleted: () => {
                alert("Successfully Updated")
            },
            refetchQueries: [ {
                query: ProfileByUserId,
                variables: {
                    userId: userID
                }
            } ]
        })
    }



    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={poppins.className}>My Profile</h2>
            </div>

            <form onSubmit={ProfileSubmitForm}>
                <input type='text' value={profile.firstname} placeholder='Firstname' onChange={(e) => setProfile({ ...profile, firstname: e.target.value })} />
                <input type='text' value={profile.lastname} placeholder='Lastanme' onChange={(e) => setProfile({ ...profile, lastname: e.target.value })} />
                <input type='tel' value={profile.phone} placeholder='Phone' onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
                <input type='date' value={profile.birthday} placeholder='Birthday' onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
                <div className={styles.btn}>
                    <button type="submit">Save</button>
                </div>
            </form>
        </div>
    )
}
