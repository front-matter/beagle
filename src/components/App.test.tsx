import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders header title', () => {
  const { getByText } = render(<App />);
  const headerTitle = getByText(/PID Services Registry/i);
  expect(headerTitle).toBeInTheDocument();
});
