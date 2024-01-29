import React, { FC, useEffect, useState } from 'react'
import PageWithLayout from '@/layout/page.layout'
import Dashboard from '@/layout/dashboard.layout'
import styles from '@/styles/dashboard/admin/inventory/category.module.scss'
import Head from 'next/head'
import { TbArrowLeft } from 'react-icons/tb'
import { GetStaticPropsContext } from 'next'
import { GetCategoryID, GetAllCategory, } from '@/lib/util/category/category.query'
import { getSearchItems } from '@/lib/util/Items/item.query'
import { client } from '@/lib/apolloWrapper'
import { Oxygen } from 'next/font/google'
import { useRouter } from 'next/router'
import { useLazyQuery, useQuery } from '@apollo/client'
import AddItem from '@/components/admin/inventory/add'
import Items from '@/components/admin/inventory/items'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'

export const getStaticPaths = async () => {

    const { data: { getAllCategory } } = await client.query({
        query: GetAllCategory
    })


    const paths = getAllCategory.map(({ categoryID }: any) => {
        return { params: { id: categoryID } }
    })

    return {
        paths, fallback: true,
    }
}

export const getStaticProps = async (context: GetStaticPropsContext) => {
    const categoryid = context.params?.id

    const { data: { getCategotiesById } } = await client.query({
        query: GetCategoryID,
        variables: {
            categoryId: categoryid
        },
    })
    return {
        props: {
            data: getCategotiesById,


        },
        revalidate: 1
    }
}


type Category = {
    categoryID: string
    category: string
    items: []
}

const oxygen = Oxygen({
    weight: "400",
    subsets: [ "latin" ]
})

const Index: FC = ({ data }: any) => {


    const router = useRouter()

    const [ add, setAddItem ] = useState(false)
    const [ userId, setUsersID ] = useState("")
    const [ search, setSearch ] = useState("")
    const onHandleCloseItem = () => {
        setAddItem(() => !add)
    }
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key == "Escape") {
            setAddItem(false)
        }
    };


    const [ searchItems, { data: searchData } ] = useLazyQuery(getSearchItems, {
        variables: {
            categoryId: router.query.id,
            search: search
        }
    })


    useEffect(() => {
        const cookies = Cookies.get("pha-tkn")
        if (cookies) {
            const { userId } = jwtDecode(cookies) as any
            setUsersID(userId)
        }
    }, [ userId ])


    if (router.isFallback) {
        return <div>loading...</div>
    }



    return (
        data.map(({ categoryID, category, items }: Category) => (
            <div className={styles.container} key={categoryID}>
                <Head>
                    <title>{category}</title>
                </Head>
                {
                    add ? <div onKeyDown={handleKeyDown} className={styles.overlay}>
                        <AddItem close={onHandleCloseItem} categoryID={categoryID} userId={userId} />
                    </div> : null
                }
                <div className={styles.addbtn}>
                    <button className={styles.goback} onClick={() => router.back()}>
                        <TbArrowLeft size={23} />
                        <span>Go back</span>
                    </button>
                    <input type='search' className={oxygen.className} placeholder='Find a specific item' onChange={(e) => {
                        searchItems()
                        setSearch(e.target.value)
                    }} />
                    <div>
                        <button onClick={() => setAddItem(() => !add)}>
                            <span className={oxygen.className}>Add</span>
                        </button>

                    </div>
                </div>

                <Items categoryID={categoryID} search={search} dataItems={searchData} userId={userId} />

            </div>
        ))
    )
}

(Index as PageWithLayout).layout = Dashboard
export default Index