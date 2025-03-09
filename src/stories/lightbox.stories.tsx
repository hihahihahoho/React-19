import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Lightbox,
  LightboxContext,
  LightBoxImageType,
  LightboxItem,
} from "@/components/ui/lightbox/lightbox";
import { LightBoxImageGrid } from "@/components/ui/lightbox/lightbox-custom";
import { useState } from "react";

const meta = {
  title: "Base/Lightbox",
  component: Lightbox,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Lightbox>;

export default meta;

type Story = StoryObj<typeof meta>;
const lightboxItems: LightBoxImageType[] = [
  {
    src: "https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg",
    alt: "Image 1",
  },
  {
    src: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/10a6ecc1-612e-4d09-ae33-45f5fe23044c/d7j0oa5-65483efb-a899-4997-ae3e-bbfd407e2cc5.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzEwYTZlY2MxLTYxMmUtNGQwOS1hZTMzLTQ1ZjVmZTIzMDQ0Y1wvZDdqMG9hNS02NTQ4M2VmYi1hODk5LTQ5OTctYWUzZS1iYmZkNDA3ZTJjYzUucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.OWV_JW8cAdFxfxQ-uRZGR9xYjZPYKIN6XcHcP4nNV1E",
    alt: "Image 2",
  },
  {
    src: "https://swiperjs.com/demos/images/nature-3.jpg",
    alt: "Image 3",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/e/e9/Cambriae_Typus_NLW.jpg",
    alt: "Image 4",
  },
  {
    src: "https://swiperjs.com/demos/images/nature-5.jpg",
    alt: "Image 5",
  },
  {
    src: "https://swiperjs.com/demos/images/nature-6.jpg",
    alt: "Image 6",
  },
  {
    src: "https://swiperjs.com/demos/images/nature-7.jpg",
    alt: "Image 7",
  },
  {
    src: "https://swiperjs.com/demos/images/nature-8.jpg",
    alt: "Image 8",
  },
  {
    src: "https://swiperjs.com/demos/images/nature-9.jpg",
    alt: "Image 9",
  },
];

export const Default: Story = {
  args: {
    images: lightboxItems,
  },
  render: () => {
    return <LightBoxImageGrid images={lightboxItems} />;
  },
};

export const InsideDialog: Story = {
  args: {
    images: lightboxItems,
  },
  render: () => {
    const [index, setIndex] = useState(0);
    const [open, setOpen] = useState(false);
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="max-w-3xl"
        >
          <DialogHeader>
            <DialogTitle>Form</DialogTitle>
            <DialogDescription>This is a form</DialogDescription>
          </DialogHeader>
          <LightboxContext>
            <div className="grid grid-cols-3 gap-2 overflow-hidden md:grid-cols-6">
              {lightboxItems.map((image, i) => (
                <LightboxItem
                  key={i}
                  src={image.src}
                  index={i}
                  selectedIndex={index}
                  onSelect={() => {
                    setIndex(i);
                    setOpen(true);
                  }}
                />
              ))}
            </div>
            <Lightbox
              open={open}
              onOpenChange={setOpen}
              index={index}
              onIndexChange={setIndex}
              images={lightboxItems}
            ></Lightbox>
          </LightboxContext>
          <DialogFooter>
            <Button variant="secondary">Cancel</Button>
            <Button>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
};

export const Custom: Story = {
  args: {
    images: lightboxItems,
  },
  render: () => {
    const [index, setIndex] = useState(0);
    const [open, setOpen] = useState(false);
    return (
      <LightboxContext>
        <div className="grid grid-cols-3 gap-2 overflow-hidden md:grid-cols-8">
          {lightboxItems.map((image, i) => (
            <LightboxItem
              key={i}
              src={image.thumb || image.src}
              index={i}
              selectedIndex={index}
              onSelect={() => {
                setIndex(i);
                setOpen(true);
              }}
            />
          ))}
        </div>
        <Lightbox
          open={open}
          onOpenChange={setOpen}
          index={index}
          onIndexChange={setIndex}
          images={lightboxItems}
        ></Lightbox>
      </LightboxContext>
    );
  },
};
