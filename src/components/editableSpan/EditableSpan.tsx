import React, {ChangeEvent, useState} from 'react';
import {TextField} from "@mui/material";

type EditAbleSpanPropsType = {
    classes?: string
    title: string
    updateTitle: (newTitle: string) => void
}

export const EditableSpan = React.memo((props: EditAbleSpanPropsType) => {
    const [editMode, setEditMode] = useState<boolean>(false)
    const [title, setTitle] = useState<string>(props.title)
    const onEditMode = () => setEditMode(true)
    const offEditMode = () => {
        setEditMode(false)
        props.updateTitle(title)
    }
    const onChangeSetTitle = (e: ChangeEvent<HTMLInputElement>)=> {
        setTitle(e.currentTarget.value)
    }
    return (
        editMode
            ? <TextField
                variant={"standard"}
                value={title}
                autoFocus
                onBlur={offEditMode}
                onChange={onChangeSetTitle}
            />
            : <span
                onDoubleClick={onEditMode}
                className={props.classes}>{props.title}</span>
    );
});
