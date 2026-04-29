import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Pagination } from './Pagination';

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  tags: ['autodocs'],
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

const Interactive = ({ total, start = 1 }: { total: number; start?: number }) => {
  const [page, setPage] = useState(start);
  return <Pagination currentPage={page} totalPages={total} onPageChange={setPage} />;
};

export const FewPages: Story = {
  render: () => <Interactive total={4} />,
};

export const ManyPages: Story = {
  render: () => <Interactive total={25} start={1} />,
};

export const Middle: Story = {
  render: () => <Interactive total={25} start={12} />,
};

export const End: Story = {
  render: () => <Interactive total={25} start={25} />,
};

export const SinglePage: Story = {
  render: () => <Interactive total={1} />,
};

export const Boundary: Story = {
  render: () => <Interactive total={7} />,
};
