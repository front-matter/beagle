import React from 'react';
import { render } from '@testing-library/react';
import Error from './Error';

test('renders with message and title', () => {
  const { getByText } = render(<Error message="Error message" title="Error title" />);
  expect(getByText("Error message")).toBeInTheDocument();
  expect(getByText("Error title")).toBeInTheDocument();
});
