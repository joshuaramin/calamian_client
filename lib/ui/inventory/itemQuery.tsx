import React, { SyntheticEvent, useState } from 'react';
import { format } from 'date-fns';
import { TbEdit, TbTrash } from 'react-icons/tb';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@apollo/client/react';
import { z } from 'zod';
import { oxygen, poppins } from '@/lib/typography';
import { ItemSchema } from '@/lib/validation/ItemSchema';
import { InputText } from '@/components/input';
import CentralPrompt from '@/components/prompt';
import { DeleteMedicalItem, UpdateMedicalItem } from '@/lib/apollo/Items/item.mutation';
import { getItemByCategoryid } from '@/lib/apollo/Items/item.query';
import styles from '@/styles/dashboard/inventory/category.module.scss';

type ItemFormValue = z.infer<typeof ItemSchema>;

type ItemTrProps = {
    itemsID: string;
    items: string;
    quantity: number;
    dosage?: string | null;
    expiredDate?: string | null;
    price: number;
    categoryID: string;
    userId: string;
};


type UpdateMedicalItemVars = {
    itemsId: string;
    userId: string;
    items: {
        items: string;
        price: number;
        quantity: number;
        expiredDate?: string | null;
        dosage?: string | null;
    };
};

type DeleteMedicalItemVars = {
    itemsId: string;
    userId: string;
};

export default function ItemTr({
    itemsID,
    items,
    quantity,
    dosage,
    expiredDate,
    price,
    categoryID,
    userId,
}: ItemTrProps) {
    const router = useRouter();

    const [ed, setEdit] = useState(false);
    const [del, setDelete] = useState(false);

    const [UpdateMutate] = useMutation<unknown, UpdateMedicalItemVars>(UpdateMedicalItem);
    const [DeleteMutation] = useMutation<unknown, DeleteMedicalItemVars>(DeleteMedicalItem);

    const { register, formState: { errors }, handleSubmit } = useForm<ItemFormValue>({
        resolver: zodResolver(ItemSchema),
        defaultValues: {
            categoryID,
            items,
            quantity,
            price,
            expiredDate: expiredDate || '',
            dosage: dosage || "",
        },
    });

    const onHandleEditMutation: SubmitHandler<ItemFormValue> = (data) => {
        UpdateMutate({
            variables: {
                itemsId: itemsID,
                userId,
                items: {
                    items: data.items,
                    price: data.price,
                    quantity: data.quantity,
                    expiredDate: data.expiredDate || null,
                    dosage: data.dosage || "",
                },
            },
            onCompleted: () => toast.success('Successfully Updated'),
            refetchQueries: [
                {
                    query: getItemByCategoryid,
                    variables: { categoryId: categoryID },
                },
            ],
        });
        setEdit(false);
    };

    const onHandleDeleteMutation = (e: SyntheticEvent) => {
        DeleteMutation({
            variables: { itemsId: itemsID, userId },
            onCompleted: () => {
                toast.success('Successfully Deleted');
                router.reload(); // optional: can replace with refetchQueries
            },
        });
        setDelete(false);
    };

    const onHandleCloseDeleteItem = () => setDelete((prev) => !prev);
    const onHandleCloseEditItem = () => setEdit((prev) => !prev);

    return (
        <tr key={itemsID}>
            <td className={oxygen.className}>{items}</td>
            <td className={oxygen.className}>
                {Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(price)}
            </td>
            <td className={oxygen.className}>x{quantity}</td>
            <td className={oxygen.className}>{dosage ?? 'N/A'}</td>
            <td className={oxygen.className}>
                {expiredDate ? format(new Date(expiredDate), 'MMMM dd, yyyy') : 'N/A'}
            </td>
            <td className={styles.actionsBtn}>
                <button className={styles.actBtn} onClick={onHandleCloseEditItem}>
                    <TbEdit size={23} />
                </button>
                <button className={styles.actBtn} onClick={onHandleCloseDeleteItem}>
                    <TbTrash size={23} />
                </button>

                {del && (
                    <CentralPrompt
                        title="Delete Item"
                        buttoName="Yes, Confirm"
                        body={
                            <span style={{ fontSize: 15 }} className={poppins.className}>
                                Are you sure you want to delete this item? Deleting it will permanently remove all
                                associated data. Once deleted, it cannot be recovered. Please confirm if you wish to
                                proceed.
                            </span>
                        }
                        headerClose={false}
                        submitHandler={onHandleDeleteMutation}
                        onClose={onHandleCloseDeleteItem}
                        footer={true}
                    />
                )}

                {ed && (
                    <CentralPrompt
                        title="Update Item"
                        headerClose={false}
                        onClose={onHandleCloseEditItem}
                        footer={true}
                        submitHandler={handleSubmit(onHandleEditMutation)}
                        buttoName="Save"
                        body={
                            <>
                                <InputText
                                    icon={false}
                                    isRequired={true}
                                    label="Item Name"
                                    name="item"
                                    type="text"
                                    register={register}
                                    error={errors.items}
                                />
                                <InputText
                                    icon={false}
                                    isRequired={true}
                                    label="Quantity"
                                    name="quantity"
                                    type="number"
                                    register={register}
                                    error={errors.quantity}
                                />
                                <InputText
                                    icon={false}
                                    isRequired={true}
                                    label="Price"
                                    name="price"
                                    type="number"
                                    register={register}
                                    error={errors.price}
                                />
                                <InputText
                                    icon={false}
                                    isRequired={false}
                                    label="Expired Date"
                                    name="expiredDate"
                                    type="date"
                                    register={register}
                                    error={errors.expiredDate}
                                />
                                <InputText
                                    icon={false}
                                    isRequired={false}
                                    label="Dosage"
                                    name="dosage"
                                    type="text"
                                    register={register}
                                    error={errors.dosage}
                                />
                            </>
                        }
                    />
                )}
            </td>
        </tr>
    );
}
