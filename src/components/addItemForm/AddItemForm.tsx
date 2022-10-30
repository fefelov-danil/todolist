import React, {KeyboardEvent, useRef, useState} from 'react';
import s from './AddItemForm.module.css'
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import {useFormik} from "formik";

type AddItemFormPropsType = {
    addItem: (title: string) => void
    value?: string
    disabled?: boolean
}

type FormikErrorType = {
    value?: string
}

export const AddItemForm: React.FC<AddItemFormPropsType> = React.memo((
    {addItem, disabled, value}
) => {
    const [editMode, setEditMode] = useState<boolean>(false)
    const form = useRef(null as HTMLDivElement | null)

    const handleClick = (e: any) => {
        if (!form.current) return
        if (!form.current.contains(e.target)) {
            setEditMode(false)
        }
    }
    document.addEventListener('click', handleClick)

    const formik = useFormik({
        initialValues: {
            value: ''
        },
        validate: (values) => {
            const errors: FormikErrorType = {}

            if (!values.value) {
                errors.value = 'The field is required'
                if (!editMode) {
                    errors.value = '';
                }
            } else if (values.value.length > 100) {
                errors.value = 'Length no more than 100 characters';
            }

            return errors
        },
        onSubmit: (values: {value: string}, {resetForm}) => {
            addItem(values.value)
            resetForm();
            setEditMode(false)
        }
    })

    const onKeyDownAddTask = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') {
            setEditMode(false)
        }
    }

    return (
        <div className={s.addItemForm}>
            {editMode
                ? <span ref={form} className={s.editMode}>
                    <form onSubmit={formik.handleSubmit}>
                        <input
                            autoFocus
                            disabled={disabled}
                            onKeyDown={onKeyDownAddTask}
                            {...formik.getFieldProps('value')}
                        />
                        <IconButton
                            type={"submit"}
                            className={s.addItemIcon}
                            sx={{color: '#333', padding: '0px'}}
                            size={"small"}
                        >
                            <AddIcon sx={{color: '#333'}}/>
                        </IconButton>
                        {editMode && formik.errors.value &&
                            <div className={s.formError}>{formik.errors.value}</div>}
                    </form>
                </span>
                : <span className={s.textMode} onClick={() => setEditMode(true)}>
                    <AddIcon className={s.addItemIcon} sx={{color: '#333'}}/>
                    <span>{value ? value : 'Add item'}</span>
                </span>
            }
        </div>
    );
})