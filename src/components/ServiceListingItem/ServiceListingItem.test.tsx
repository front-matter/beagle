import React from 'react';
import { render } from '@testing-library/react';
import ServiceListingItem from './ServiceListingItem';

const exampleService = {
    name: "Example service",
    description: "Exampe description of the service.",
    url: "http://example.com",
    organization: "Example Inc"
}

test('renders service details', () => {
  const { getByText } = render(<ServiceListingItem service={exampleService}/>);

  expect(getByText("Example service")).toBeInTheDocument();
  expect(getByText("Exampe description of the service.")).toBeInTheDocument();
  expect(getByText("http://example.com")).toBeInTheDocument();
  expect(getByText("Example Inc")).toBeInTheDocument();
});
