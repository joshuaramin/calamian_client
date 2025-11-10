import React, { useState, useEffect } from 'react'
import styles from './myprofile.module.scss'
import { ProfileByUserId } from '@/lib/apollo/User/profile/profile.query'
import { useMutation, useQuery } from '@apollo/client/react'
import { ProfileUpdate } from '@/lib/apollo/User/profile/profile.mutation'
import store from 'store2'
import { SubmitHandler, useForm } from 'react-hook-form'
import { poppins } from '@/lib/typography'
import z from 'zod'
import { ProfileSchema } from '@/lib/validation/ProfileSchema'
import { InputText } from '@/components/input'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import ToastNotification from '@/components/toastNotification'


type ProfileFormValues = z.infer<typeof ProfileSchema>

export default function MyProfile() {



    const [userID, setUserID] = useState("")


    useEffect(() => {
        const user = store.get("UserAccount")
        setUserID(user.user_id)
    }, [userID])

    const { data } = useQuery(ProfileByUserId, {
        variables: {
            userId: userID
        }
    })

    const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormValues>({
        resolver: zodResolver(ProfileSchema),
        values: data?.getProfileByUserId ?? {
            firstname: "",
            lastname: "",
            birthday: "",
            phone: "",
        },
    });

    const [mutate] = useMutation(ProfileUpdate)

    const ProfileSubmitForm: SubmitHandler<ProfileFormValues> = (data) => {

        mutate({
            variables: {
                userId: userID,
                firstname: data.firstname,
                lastname: data.lastname,
                phone: data.phone,
                birthday: data.birthday
            },
            onCompleted: () => {
                toast.success("Successfully Updated")
            },
            refetchQueries: [{
                query: ProfileByUserId,
                variables: {
                    userId: userID
                }
            }]
        })
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={poppins.className}>My Profile</h2>
            </div>

            <form onSubmit={handleSubmit(ProfileSubmitForm)}>
                <InputText
                    icon={false}
                    label={'First Name'}
                    name={'firstname'}
                    isRequired={false}
                    error={errors.firstname}
                    register={register}
                />
                <InputText
                    icon={false}
                    label={'Last Name'}
                    name={'lastname'}
                    isRequired={false}
                    error={errors.lastname}
                    register={register}
                />
                <InputText
                    icon={false}
                    label={'Birthday'}
                    name={'birthday'}
                    isRequired={false}
                    error={errors.birthday}
                    type='date'
                    register={register}
                />
                <InputText
                    icon={false}
                    label={'Phone'}
                    name={'phone'}
                    isRequired={false}
                    error={errors.phone}
                    register={register}
                />
                <div className={styles.btn}>
                    <button type="submit">Save</button>
                </div>
            </form>
            <ToastNotification />
        </div>
    )
}
