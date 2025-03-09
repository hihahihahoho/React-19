import { TestZoom } from "@/components/ui/test-zoom";
import type { Meta, StoryObj } from "@storybook/react";
import useEmblaCarousel from "embla-carousel-react";

const meta = {
  title: "Base/TestZoom",
  component: TestZoom,
  parameters: {},
} satisfies Meta<typeof TestZoom>;

export default meta;
type Story = StoryObj<typeof meta>;
/** Default select with placeholder */
export const Default: Story = {};

export const Custom: Story = {
  args: {},
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [emblaRef] = useEmblaCarousel({});
    return (
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          <div className="embla__slide">
            <TestZoom />
          </div>
          <div className="embla__slide">
            <TestZoom />
          </div>
          <div className="embla__slide">
            <TestZoom />
          </div>
        </div>
      </div>
    );
  },
};
