import React from 'react';
import { render } from '@testing-library/react';
import ServiceListingItem from './ServiceListingItem';

const exampleService = {
    id: "http://example.com/1234",
    name: "Example service",
    description: "Exampe description of the service.",
    organization: "Example Inc"
}

test('renders service details', () => {
  const { getByText } = render(<ServiceListingItem service={exampleService}/>);

  expect(getByText("Example service")).toBeInTheDocument();
  expect(getByText("Access Service").closest('a')).toHaveAttribute('href', 'http://example.com/1234');
  expect(getByText("Exampe description of the service.")).toBeInTheDocument();
  expect(getByText("Provided by: Example Inc")).toBeInTheDocument();
});
