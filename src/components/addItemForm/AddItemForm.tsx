import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {IconButton, TextField} from "@mui/material";
import {AddCircleOutline} from "@mui/icons-material";

type AddItemFormPropsType = {
    addItem: (title: string) => void
    disabled: boolean
}

export const AddItemForm = React.memo( (props: AddItemFormPropsType) => {
    const [title, setTitle] = useState<string>("")
    const [error, setError] = useState<boolean>(false)

    const addTask = () => {
        const itemTitle = title.trim()
        if(itemTitle){
            props.addItem(itemTitle)
        } else {
            setError(true)
        }
        setTitle("")
    }

    const onChangeSetTitle = (e: ChangeEvent<HTMLInputElement>)=> {
        setTitle(e.currentTarget.value)
        const itemTitle = e.currentTarget.value.trim()
        if(error && itemTitle) setError(false)
        if(!error && !itemTitle) setError(true)
    }

    const onKeyDownAddTask  = (e: KeyboardEvent<HTMLInputElement>)=> e.key === "Enter" && addTask()

    return (
        <div>
            <TextField
                size={"small"}
                variant={"outlined"}
                color={"primary"}
                value={title}
                label={"Title"}
                onChange={onChangeSetTitle}
                onKeyDown={onKeyDownAddTask}
                disabled={props.disabled}
                error={error}
                helperText={error && "Title is required!"}
            />
            <IconButton
                color={"primary"}
                size={"small"}
                disabled={props.disabled}
                onClick={addTask}>
                <AddCircleOutline/>
            </IconButton>
        </div>
    );
} )