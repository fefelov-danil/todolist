import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {AddCircleOutline} from "@material-ui/icons";
import {IconButton, TextField} from "@material-ui/core";

type AddItemFormPropsType = {
    addItem: (title: string) => void
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
                error={error}
                helperText={error && "Title is required!"}
            />
            <IconButton
                color={"primary"}
                size={"small"}
                onClick={addTask}>
                <AddCircleOutline/>
            </IconButton>
        </div>
    );
} )