import { Meta, Story } from '@storybook/react';
import { Contestant as ContestantData } from '../types';
import { Contestant, ContestantProps } from './Contestant';

const contestant: ContestantData = {
  name: 'Nick Nisi',
  handle: 'nicknisi',
  avatar: 'https://pbs.twimg.com/profile_images/1455971061271498755/oIr282mQ_400x400.jpg',
  score: 0,
};

export default {
  title: 'Components / Contestant',
  args: {
    ...contestant,
    onIncrement: () => {},
    onDecrement: () => {},
  },
} as Meta;

export const Default: Story<ContestantProps> = (args) => <Contestant {...args} />;
export const Large: Story<ContestantProps> = (args) => <Contestant {...args} large />;
