import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FilePicker, type PickedFile } from '@amplify-ai/ui';

const meta = {
  title: 'Components/Forms/FilePicker',
  component: FilePicker,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof FilePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Inline: Story = {
  args: { label: 'Upload assets', helperText: 'PNG, JPG, MP4 or PDF up to 10 MB' },
};

export const SingleFile: Story = {
  args: { label: 'Upload avatar', multiple: false, accept: 'image/*' },
};

export const ImagesOnly: Story = {
  args: { label: 'Image gallery', accept: 'image/*', maxSize: 5_000_000 },
};

export const WithMaxFiles: Story = {
  args: {
    label: 'Up to 3 files',
    maxFiles: 3,
    helperText: 'Limit reached after 3.',
  },
};

export const WithProgress: Story = {
  render: (args) => {
    const [files, setFiles] = useState<PickedFile[]>([]);
    const [progress, setProgress] = useState<Record<string, number>>({});
    return (
      <div>
        <FilePicker
          {...args}
          value={files}
          onChange={(next) => {
            setFiles(next);
            // simulate upload progress for new files
            for (const f of next) {
              if (progress[f.id] !== undefined) continue;
              let p = 0;
              const id = f.id;
              const t = setInterval(() => {
                p += 10;
                setProgress((prev) => ({ ...prev, [id]: Math.min(100, p) }));
                if (p >= 100) clearInterval(t);
              }, 250);
            }
          }}
          progressMap={progress}
          label="Pick files (mock progress)"
        />
      </div>
    );
  },
};

export const Modal: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <button onClick={() => setOpen(true)} style={{ padding: '8px 14px', borderRadius: 12, background: '#6531FF', color: 'white' }}>
          Open uploader
        </button>
        <FilePicker {...args} variant="modal" open={open} onClose={() => setOpen(false)} label="Upload files" />
      </div>
    );
  },
};

export const Drawer: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <button onClick={() => setOpen(true)} style={{ padding: '8px 14px', borderRadius: 12, background: '#6531FF', color: 'white' }}>
          Open drawer uploader
        </button>
        <FilePicker {...args} variant="drawer" open={open} onClose={() => setOpen(false)} label="Upload files" />
      </div>
    );
  },
};

export const Disabled: Story = {
  args: { label: 'Upload disabled', disabled: true },
};
