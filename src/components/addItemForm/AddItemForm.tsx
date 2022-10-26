import React, {ChangeEvent, KeyboardEvent, useRef, useState} from 'react';
import s from './AddItemForm.module.css'
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';

type AddItemFormPropsType = {
    addItem: (title: string) => void
    value?: string
    disabled?: boolean
}

export const AddItemForm: React.FC<AddItemFormPropsType> = React.memo((
    {addItem, disabled, value}
) => {
    const [editMode, setEditMode] = useState<boolean>(false)
    const [title, setTitle] = useState<string>("")
    const [error, setError] = useState<boolean>(false)

    const editTextSpan = useRef(null as HTMLSpanElement | null)

    const handleClick = (e: any) => {
        if (!editTextSpan.current) return
        if (!editTextSpan.current.contains(e.target)) {
            setEditMode(false)
        }
    }

    document.addEventListener('click', handleClick)

    const addTask = () => {
        const itemTitle = title.trim()
        if (itemTitle) {
            addItem(itemTitle)
            setEditMode(false)
        } else {
            setError(true)
        }
        setTitle("")
    }

    const onChangeSetTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
        const itemTitle = e.currentTarget.value.trim()
        if (error && itemTitle) setError(false)
        if (!error && !itemTitle) setError(true)
    }

    const onKeyDownAddTask = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') {
            setEditMode(false)
        }
        if (e.key === 'Enter') {
            addTask()
            setEditMode(false)
        }
    }

    return (
        <div className={s.addItemForm}>
            {editMode
                ? <span ref={editTextSpan} className={s.editMode}>
                    <input
                        className={error ? s.errorInp : ''}
                        autoFocus
                        value={title}
                        onChange={onChangeSetTitle}
                        onKeyDown={onKeyDownAddTask}
                    />
                    <span className={s.errorText}>{error && "The field is required"}</span>
                    <IconButton
                        className={s.addItemIcon}
                        sx={{color: '#333', padding: '0px'}}
                        size={"small"}
                        disabled={title ? disabled : true}
                        onClick={addTask}>
                        <AddIcon className={!title ? s.disabledIcon : ''} sx={{color: '#333'}}/>
                    </IconButton>
                </span>
                : <span className={s.textMode} onClick={() => setEditMode(true)}>
                    <AddIcon className={s.addItemIcon} sx={{color: '#333'}}/>
                    <span>{value ? value : 'Add item'}</span>
                </span>
            }

        </div>
    );
})