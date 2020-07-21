import React from 'react';
import { render, wait } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';

import { SERVICE_GQL, ServiceOverview } from './ServiceOverview';

const mocks = [
  {
    request: {
      query: SERVICE_GQL,
      variables: {
        id: 'https://handle.test.datacite.org/10.24427/141E-N846',
      },
    },
    result: {
      data: {
        service: {
          id: 'https://handle.test.datacite.org/10.24427/141E-N846',
          doi: '10.24427/141E-N846',
          titles: [{
            title: "This is a test service."
          }],
          descriptions: [{
            description: "This test service is rendered using mocked data.",
            descriptionType: ""
          }],
          creators: [{
            name: "Example Inc"
          }]
        },
      },
    },
  },
];


test('renders', async () => {
  const { container } = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <ServiceOverview serviceId="10.24427/141E-N846" />
    </MockedProvider>
  );

  expect(container).toMatchSnapshot();

  // wait for content
  await wait(() => container);

  // take a snapshot of the rendered content (error or data)
  expect(container).toMatchSnapshot();
});
