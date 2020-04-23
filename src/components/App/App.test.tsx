import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders header title', () => {
  const { queryByTestId } = render(<App />);
  const headerTitle = queryByTestId('navbar-brand');
  expect(headerTitle).toBeInTheDocument();
});
