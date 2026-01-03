"use client";

import React, { FC, useEffect, useState } from "react";
import PageWithLayout from "@/layout/page.layout";
import Dashboard from "@/layout/dashboard.layout";
import styles from "@/styles/dashboard/inventory/category.module.scss";
import Head from "next/head";
import { TbArrowLeft } from "react-icons/tb";
import { GetCategoryID } from "@/lib/apollo/category/category.query";
import { getSearchItems } from "@/lib/apollo/Items/item.query";
import { client } from "@/lib/apollo/apolloWrapper";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "@apollo/client/react";
import Items from "@/lib/ui/inventory/items";
import { oxygen } from "@/lib/typography";
import store from "store2";
import CentralPrompt from "@/components/prompt";
import { InputText } from "@/components/input";
import { ItemSchema } from "@/lib/validation/ItemSchema";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ItemMutation } from "@/lib/apollo/Items/item.mutation";
import toast from "react-hot-toast";
import useSearch from "@/lib/hooks/useSearch";
import useToggle from "@/lib/hooks/useToggle";
import { GetServerSideProps } from "next";

type ItemFormValue = z.infer<typeof ItemSchema>;

interface Category {
    categoryID: string;
    category: string;
}

interface CategoryProps {
    data: Category;
}

interface InventoryQueryResponse {
    getSearchItems: any[];
}

const Index: FC<CategoryProps> = ({ data }) => {
    const router = useRouter();
    const add = useToggle();
    const search = useSearch();

    const categoryId =
        typeof router.query.id === "string" ? router.query.id : data.categoryID;

    const [userId, setUserId] = useState<string>("");
    const [numberOfDosage, setNumberOfDosage] = useState(false);
    const [expirationDate, setExpirationDate] = useState(false);

    useEffect(() => {
        const user = store.get("UserAccount");
        if (user?.user_id) {
            setUserId(user.user_id);
        }
    }, []);

    const { data: inventoryData } = useQuery<InventoryQueryResponse>(getSearchItems, {
        variables: { categoryId, search: "" },
    });

    const { register, formState: { errors }, handleSubmit, reset } = useForm<ItemFormValue>({
        resolver: zodResolver(ItemSchema),
        defaultValues: {
            categoryID: categoryId,
            expiredDate: "",
            dosage: "",
            items: "",
            price: 1,
            quantity: 1,
        },
    });

    const [createItem] = useMutation(ItemMutation);

    const onHandleMutation: SubmitHandler<ItemFormValue> = formData => {
        if (!userId) {
            toast.error("User not authenticated");
            return;
        }

        createItem({
            variables: {
                userId: userId,
                items: {
                    dosage: formData.dosage,
                    expiredDate: formData.expiredDate || null,
                    items: formData.items,
                    price: formData.price,
                    quantity: formData.quantity || 1,
                },
                categoryId: categoryId,
            },
            onCompleted: () => {
                toast.success("Successfully Created");
                reset({
                    expiredDate: "",
                    dosage: "",
                    items: "",
                    price: 1,
                    quantity: 1,
                });
                add.updateToggle();

                router.reload()
            },
        });
    };

    return (
        <div className={styles.container} key={data.categoryID}>
            <Head>
                <title>{data.category}</title>
            </Head>

            {add.toggle && (
                <CentralPrompt
                    title="Add Item"
                    headerClose={false}
                    onClose={add.updateToggle}
                    footer
                    buttoName="Add"
                    submitHandler={handleSubmit(onHandleMutation)}
                    body={
                        <>
                            <InputText
                                icon={false}
                                isRequired
                                label="Item Name"
                                name="items"
                                register={register}
                                type="text"
                                error={errors.items}
                            />

                            <InputText
                                icon={false}
                                isRequired
                                label="Quantity"
                                name="quantity"
                                type="number"
                                register={register}
                                error={errors.quantity}
                            />

                            <InputText
                                icon={false}
                                isRequired
                                label="Price"
                                name="price"
                                type="number"
                                register={register}
                                error={errors.price}
                            />

                            {expirationDate && (
                                <InputText
                                    icon={false}
                                    isRequired
                                    label="Expired Date"
                                    name="expiredDate"
                                    type="date"
                                    register={register}
                                    error={errors.expiredDate}
                                />
                            )}

                            {numberOfDosage && (
                                <InputText
                                    icon={false}
                                    isRequired
                                    label="Dosage"
                                    name="dosage"
                                    register={register}
                                    error={errors.dosage}
                                />
                            )}

                            <div className={styles.check}>
                                <label>
                                    <input
                                        type="checkbox"
                                        onChange={() => setNumberOfDosage(prev => !prev)}
                                    />
                                    <span className={oxygen.className}>Dosage</span>
                                </label>

                                <label>
                                    <input
                                        type="checkbox"
                                        onChange={() => setExpirationDate(prev => !prev)}
                                    />
                                    <span className={oxygen.className}>Expired Date</span>
                                </label>
                            </div>
                        </>
                    }
                />
            )}

            <div className={styles.addbtn}>
                <button className={styles.goback} onClick={() => router.back()}>
                    <TbArrowLeft size={23} />
                    <span>Go back</span>
                </button>

                <input
                    type="search"
                    className={oxygen.className}
                    placeholder="Find a specific item"
                    onChange={e => search.updateSearch(e.currentTarget.value)}
                />

                <button onClick={add.updateToggle}>
                    <span className={oxygen.className}>Add</span>
                </button>
            </div>

            <Items
                categoryID={data.categoryID}
                search={search.search}
                dataItems={inventoryData}
                userId={userId}
            />
        </div>
    );
};

// Server-side rendering
export const getServerSideProps: GetServerSideProps<CategoryProps> = async (context) => {
    const categoryId = context.params?.id as string;

    try {
        const { data } = await client.query<{ getCategotiesById: Category }>({
            query: GetCategoryID,
            variables: { categoryId },
        });

        if (!data?.getCategotiesById) {
            return { notFound: true };
        }

        return {
            props: { data: data?.getCategotiesById },
        };
    } catch (err) {
        console.error("Error fetching category:", err);
        return { notFound: true };
    }
};

(Index as PageWithLayout).layout = Dashboard;
export default Index;
