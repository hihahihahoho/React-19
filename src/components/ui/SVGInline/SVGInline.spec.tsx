import { render } from '@testing-library/react';

import { SVGInline } from './SVGInline';

describe('SVGInline', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SVGInline />);
    expect(baseElement).toBeTruthy();
  });
});
