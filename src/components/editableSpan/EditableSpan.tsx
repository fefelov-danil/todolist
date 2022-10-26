import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import s from './EditableSpan.module.css';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import IconButton from "@mui/material/IconButton";

type EditAbleSpanPropsType = {
    size: 'small' | 'big'
    value: string
    updateTitle: (newTitle: string) => void
    disabled: boolean
}

export const EditableSpan: React.FC<EditAbleSpanPropsType> = React.memo((
    {size, value, updateTitle, disabled}
) => {
    const [editMode, setEditMode] = useState<boolean>(false)
    const [title, setTitle] = useState<string>(value)
    const [error, setError] = useState<boolean>(false)

    const onEditMode = () => {
        !disabled && setEditMode(true)
    }
    const offEditMode = () => {
        if (title === value) {
            setEditMode(false)
            return
        }
        const itemTitle = title.trim()
        if (itemTitle) {
            updateTitle(title)
            setEditMode(false)
        } else {
            setError(true)
        }
    }

    const onChangeSetTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
        const itemTitle = e.currentTarget.value.trim()
        if (error && itemTitle) setError(false)
        if (!error && !itemTitle) setError(true)
    }
    const onKeyDownChangeText = (e: KeyboardEvent<HTMLInputElement>) => {
        e.key === "Enter" && offEditMode()
    }

    return (
        <span className={size === 'big' ? s.big : s.small}>
            {
                editMode
                    ? <span className={s.editMode}>
                        <input
                            className={error ? s.errorInp : ''}
                            value={title}
                            autoFocus
                            onBlur={offEditMode}
                            onChange={onChangeSetTitle}
                            onKeyDown={onKeyDownChangeText}
                            style={{fontFamily: size === 'big' ? 'Oswald' : 'OpenSans'}}/>
                        <span className={s.errorText}>{error && "The field is required"}</span>
                        <IconButton
                            className={s.changeTextIcon}
                            onClick={offEditMode}
                            disabled={title ? disabled : true}
                            sx={{color: '#333', padding: '0px'}}
                            size={"small"}>
                                <CheckIcon className={!title ? s.disabledIcon : ''} sx={{fontSize: 19}}/>
                        </IconButton>
                    </span>
                    : <span
                        onClick={onEditMode}
                        className={s.textMode}>
                        {value}
                        <EditIcon
                            className={s.editTextIcon}
                            sx={{fontSize: 17, color: '#777'}}/>
                    </span>
            }
        </span>

    );
});
