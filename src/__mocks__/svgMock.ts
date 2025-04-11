import React from 'react';

const SvgMock = React.forwardRef<
  HTMLSpanElement,
  React.SVGProps<SVGSVGElement>
>((props, ref) => {
  return React.createElement('span', {
    ref,
    ...props,
    'data-testid': 'svg-mock',
  });
});

SvgMock.displayName = 'SvgMock';

export default SvgMock;
export const ReactComponent = SvgMock;
