import React, {JSXElementConstructor} from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import {AddItemForm} from './AddItemForm';
import {action} from "@storybook/addon-actions";

export default {
    title: 'AddItemForm',
    component: AddItemForm,
    argTypes: {
        addItem: {
            description: 'Отправка value в родительскую компоненту'
        }
    },
} as ComponentMeta<typeof AddItemForm>;

const Template: ComponentStory<typeof AddItemForm> = (args) => {
    return <AddItemForm {...args} />;
}

export const AddItemFormStory = Template.bind({});
AddItemFormStory.args = {
    addItem: action('addItem')
};