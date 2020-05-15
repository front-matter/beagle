import React from 'react';
import { render, wait } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';

import { SERVICES_GQL, Search } from './Search';

const mocks = [
  {
    request: {
      query: SERVICES_GQL,
      variables: {
        query: '',
        cursor: ''
      },
    },
    result: {
      data: {
        services: {
            edges: [
                {
                    node: {
                        id: 'https://handle.test.datacite.org/10.24427/141E-N846',
                        doi: '10.24427/141E-N846' ,
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
                    }
                },
                {
                    node: {
                        id: 'https://handle.test.datacite.org/10.24427/8gt9-nk59',
                        doi: '10.24427/8gt9-nk59' ,
                        titles: [{
                            title: "This is a test service."
                        }],
                        descriptions: [{
                            description: "This test service is rendered using mocked data.",
                            descriptionType: ""
                        }],
                        creators: [{
                            name: "Acme Inc"
                        }]
                        },
                }
            ],
            pageInfo: {
                endCursor: "NA",
                hasNextPage: false,
            },
            totalCount: 2,
        }
      },
    },
  },
];


test('renders', async () => {
  const { container } = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <Search />
    </MockedProvider>
  );

  expect(container).toMatchSnapshot();

  // wait for content
  await wait(()=> container);

  // take a snapshot of the rendered content (error or data)
  expect(container).toMatchSnapshot();
});
