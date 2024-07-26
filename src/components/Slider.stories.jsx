import React from 'react';
import Slider from './Slider';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Components/Slider',
  component: Slider,
  argTypes: {
    min: { control: { type: 'number' } },
    max: { control: { type: 'number' } },
    step: { control: { type: 'number' } },
    initialValue: { control: { type: 'number' } },
    type: { control: { type: 'select', options: ['continuous', 'discreet'] } },
    subtype: { control: { type: 'select', options: ['single', 'range'] } },
    handleSize: { control: { type: 'select', options: ['Size_24', 'Size_32'] } },
  },
};

const Template = (args) => <Slider {...args} onChange={action('changed')} />;

export const Default = Template.bind({});
Default.args = {
  min: 0,
  max: 100,
  step: 1,
  initialValue: 0,
  type: 'continuous',
  subtype: 'single',
  handleSize: 'Size_32',
};
