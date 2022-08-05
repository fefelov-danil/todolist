import {EditableSpan} from "./EditableSpan";
import {ComponentStory} from "@storybook/react";
import {action} from "@storybook/addon-actions";

export default {
    title: 'EditableSpan',
    component: EditableSpan
}

const Template: ComponentStory<typeof EditableSpan> = (args) => <EditableSpan {...args}/>

export const EditableSpanStory = Template.bind({})
EditableSpanStory.args = {
    title: 'EditableSpan',
    updateTitle: action('EditableSpan value change')
}