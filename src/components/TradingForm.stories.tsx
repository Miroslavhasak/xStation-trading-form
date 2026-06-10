import type { Meta, StoryObj } from '@storybook/react';
import TradingForm from './TradingForm';

const meta: Meta<typeof TradingForm> = {
  title: 'Components/TradingForm',
  component: TradingForm,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof TradingForm>;

export const Predvoleny: Story = {};