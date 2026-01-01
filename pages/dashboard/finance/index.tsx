import Dashboard from "@/layout/dashboard.layout";
import PageWithLayout from "@/layout/page.layout";
import React, { FC, useEffect, useState } from "react";
import Head from "next/head";
import styles from "@/styles/dashboard/finance/finance.module.scss";
import FinanceQuery from "@/lib/ui/finance/financeQuery";
import { TbLayoutColumns, TbLayoutList } from "react-icons/tb";
import { useLocalStorageValue } from "@react-hookz/web";
import { useMutation, useQuery } from "@apollo/client/react";
import { GetAllExpenseFolder } from "@/lib/apollo/finance/finance.query";
import store from "store2";
import CentralPrompt from "@/components/prompt";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { ExpenseFolderSchema } from "@/lib/validation/ExpenseFolder";
import { CreateExpenseFolderMutation } from "@/lib/apollo/finance/finance.mutation";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputText } from "@/components/input";
import useToggle from "@/lib/hooks/useToggle";
import useSearch from "@/lib/hooks/useSearch";
import ToastNotification from "@/components/toastNotification";
import toast from "react-hot-toast";

type ExpenseFolderFormValue = z.infer<typeof ExpenseFolderSchema>;

interface ExpenseFolder {
    expFolderID: string;
    exFolder: string;
}

interface GetAllExpenseFolderResponse {
    getAllExpenseFolder: ExpenseFolder[];
}


const Finance: FC = () => {
    const [userId, setUserId] = useState<string>("");

    const addNewFolder = useToggle();
    const search = useSearch();

    useEffect(() => {
        const user = store.get("UserAccount");
        if (user?.user_id) {
            setUserId(user.user_id);
        }
    }, []); // ✅ FIX: no dependency loop


    const { loading, data } = useQuery<GetAllExpenseFolderResponse>(
        GetAllExpenseFolder,
        {
            variables: {
                search: search.search,
            },
        }
    );


    const dataStore = useLocalStorageValue<boolean>("FCROW", {
        initializeWithValue: false,
    });

    const onHandleLocalStorageStore = () => {
        dataStore.set(!dataStore.value);
    };


    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm<ExpenseFolderFormValue>({
        resolver: zodResolver(ExpenseFolderSchema),
        defaultValues: {
            exFolder: "",
        },
    });


    const [createExpenseFolder] = useMutation(
        CreateExpenseFolderMutation
    );

    const onHandleSubmit: SubmitHandler<ExpenseFolderFormValue> = (
        formData
    ) => {
        if (!userId) {
            toast.error("User not authenticated");
            return;
        }

        createExpenseFolder({
            variables: {
                exFolder: formData.exFolder,
                userId,
            },
            onCompleted: () => {
                toast.success("Successfully Created");
                reset({ exFolder: "" });
                addNewFolder.updateToggle();
            },
        });
    };


    return (
        <div className={styles.container}>
            <Head>
                <title>Finance</title>
            </Head>

            {/* ADD FOLDER MODAL */}
            {addNewFolder.toggle && (
                <CentralPrompt
                    onClose={addNewFolder.updateToggle}
                    footer
                    headerClose={false}
                    title="Add new Expense Folder"
                    buttoName="Submit"
                    body={
                        <InputText
                            icon={false}
                            isRequired
                            label="Expense Folder Name"
                            name="exFolder"
                            register={register}
                            type="text"
                            error={errors.exFolder}
                        />
                    }
                    submitHandler={handleSubmit(onHandleSubmit)}
                />
            )}

            {/* SEARCH */}
            <div className={styles.search}>
                <input
                    type="search"
                    placeholder="Find an Expense Folder"
                    onChange={(e) => search.updateSearch(e.currentTarget.value)}
                />
                <button onClick={addNewFolder.updateToggle}>New</button>
            </div>

            {/* VIEW TOGGLE */}
            <div className={styles.filter}>
                <button onClick={onHandleLocalStorageStore}>
                    {dataStore.value ? (
                        <TbLayoutList size={25} />
                    ) : (
                        <TbLayoutColumns size={25} />
                    )}
                </button>
            </div>

            {/* LIST */}
            <div
                className={
                    dataStore.value ? styles.row : styles.column
                }
            >
                {loading && "Loading..."}

                {!loading &&
                    data?.getAllExpenseFolder.map(
                        ({ expFolderID, exFolder }) => (
                            <FinanceQuery
                                key={expFolderID}
                                expFolderID={expFolderID}
                                exFolder={exFolder}
                            />
                        )
                    )}
            </div>

            <ToastNotification />
        </div>
    );
};


(Finance as PageWithLayout).layout = Dashboard;
export default Finance;
