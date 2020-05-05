import React from 'react';
import { render } from '@testing-library/react';
import ServiceListingItem from './ServiceListingItem';

const exampleService = {
    id: "http://example.com/1234",
    doi: "1234",
    name: "Example service",
    description: "Example description of the service.",
    creators: ["Example Inc"]
}

test('renders service details', () => {
  const { getByText } = render(<ServiceListingItem service={exampleService}/>);

  expect(getByText("Example service")).toBeInTheDocument();
  expect(getByText("Example Inc")).toBeInTheDocument();
  expect(getByText("Access Service").closest('a')).toHaveAttribute('href', 'http://example.com/1234');
  expect(getByText("Example description of the service.")).toBeInTheDocument();
});
