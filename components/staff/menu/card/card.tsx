import React, { useEffect, useState } from 'react'
import styles from './card.module.scss'
import { Oxygen, Poppins } from 'next/font/google'
import { TbPlus, TbMinus, TbShoppingCart, TbChevronRight } from 'react-icons/tb'
import { carrItemsVar } from "@/lib/apollo/apolloWrapper"
import { useReactiveVar } from '@apollo/client/react'

interface Items {
    itemsID: string
    items: string
    price: number
    quan: number
    category: []
    storeInfo: []
}

const poppins = Poppins({
    weight: "400",
    subsets: ["latin"]
})

const oxygen = Oxygen({
    weight: "400",
    subsets: ["latin"]
})
export default function MenuCard({ itemsID, items, category, price, quan }: Items) {


    const [quantity, setQuantity] = useState(0)

    const handleQuantityIncrement = () => {
        setQuantity(() => quantity + 1)
    }

    const handleQuantityDecrement = () => {
        setQuantity(() => quantity - 1)
    }


    const cart = useReactiveVar(carrItemsVar)

    const item = cart.some((a: Items) => a.itemsID === itemsID)



    const removeDuplicateItem = cart.filter((a: Items) => a.itemsID !== itemsID)


    useEffect(() => {
        if (cart.length === 0) {
            setQuantity(0)
        }
    }, [cart.length])
    return (
        <div className={styles.container}>
            {category.map(({ category }: any) => (
                <div className={styles.specify} key={category}>
                    <span className={oxygen.className}>{category}</span><TbChevronRight />
                    <span className={oxygen.className}>{quan === 0 ? "Out of Stock" : `Remaining:  ${quan - quantity} `} </span>
                </div>
            ))}
            <div className={styles.shoppingInfo}>
                <h2 className={poppins.className}>{items}</h2>
                <span className={oxygen.className}>{Intl.NumberFormat("en-US", { style: "currency", currency: "PHP" }).format(price)}</span>
            </div>
            <div className={styles.shoppingCart}>
                <div className={styles.addQ}>
                    <button disabled={quantity === quan || item} onClick={handleQuantityIncrement}>
                        <TbPlus size={23} />
                    </button>
                    <span className={oxygen.className}>{quantity}</span>
                    <button disabled={quan === 0 || quantity <= 0 || item} onClick={handleQuantityDecrement}>
                        <TbMinus size={23} />
                    </button>
                </div>
                <button className={item ? styles.active : styles.inactive} disabled={quantity <= 0} onClick={() => carrItemsVar(item ? removeDuplicateItem : [...carrItemsVar(), { itemsID, items, price, quantity, total: price * quantity }] as any)}>
                    <TbShoppingCart size={23} />
                </button>
            </div>

        </div>
    )
}
