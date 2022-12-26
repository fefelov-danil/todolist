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
  const [title, setTitle] = useState<string>('')
  const [error, setError] = useState<boolean | string>(false)

  const form = useRef(null as HTMLDivElement | null)

  const handleClick = (e: any) => {
    if (!form.current) return
    if (!form.current.contains(e.target)) {
      setEditMode(false)
    }
  }
  document.addEventListener('click', handleClick)

  const onEditMode = () => {
    !disabled && setEditMode(true)
  }
  const addItemHandler = () => {
    const itemTitle = title.trim()
    if (itemTitle) {
      addItem(itemTitle)
      setTitle('')
      setEditMode(false)
    } else {
      setError("The field is required")
    }
  }

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value)
    const itemTitle = e.currentTarget.value.trim()
    if (error && itemTitle) setError(false)
    if (itemTitle.length >= 100) setError("Length no more than 100 characters")
  }
  const onKeyDownAddItem = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setEditMode(false)
    }
    if (e.key === 'Enter') {
      addItemHandler()
    }
  }

  return (
    <div className={s.addItemForm}>
      {editMode
        ? <span ref={form} className={s.editMode}>
                    <input
                      className={error ? s.errorInp : ''}
                      value={title}
                      autoFocus
                      onChange={onChangeHandler}
                      onKeyDown={onKeyDownAddItem}
                    />
          {editMode && error && <div className={s.formError}>{error}</div>}
          <IconButton
            type={"submit"}
            className={s.addItemIcon}
            onClick={addItemHandler}
            sx={{color: '#333', padding: '0px'}}
            size={"small"}
          >
                        <AddIcon sx={{color: '#333'}}/>
                    </IconButton>
                </span>
        : <span className={s.textMode} onClick={onEditMode}>
                    <AddIcon className={s.addItemIcon} sx={{color: '#333'}}/>
                    <span>{value ? value : 'Add item'}</span>
                </span>
      }
    </div>
  );
})