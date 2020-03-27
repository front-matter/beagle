import React from 'react';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import { Service } from '../ServiceListingItem/ServiceListingItem';
import ServiceListingItem from '../ServiceListingItem/ServiceListingItem';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import './Search.css';

type Props = {

};

interface ServiceQueryResult {
    id: string;
    titles: [{
        title: string
    }]
}

interface ServiceQueryData {
    services: {
        nodes: ServiceQueryResult[];
    },
}

interface ServiceQueryVar {
    query: string;
}

const SERVICES_GQL = gql`
query getServicesQuery($query: String!) {
    services(query: $query) {
      nodes {
        id,
        titles {
          title
        }
      }
    }
  }
`;

const Search: React.FunctionComponent<Props> = () => {
    const [searchQuery, setSearchQuery] = React.useState("");
    const [searchResults, setSearchResults] = React.useState<Service[]>([]);
    const { loading, error, data, refetch } = useQuery<ServiceQueryData, ServiceQueryVar>(
        SERVICES_GQL,
        { variables: { query: "" }
    })

    const onSearchChange = (e: React.FormEvent<HTMLInputElement>): void => {
        setSearchQuery(e.currentTarget.value);
    };

    React.useEffect(() => {
        refetch({ query: searchQuery})

        const results: Service[] = [];
        if(data) {
            data.services.nodes.map(dataset => (
                results.push(
                    {
                        id: dataset.id,
                        name: dataset.titles[0].title,
                        description: "Example description of the service.",
                        url: "http://example.com",
                        organization: "Example Inc"
                    }
                )
            ))
        }
        setSearchResults(results);
    }, [searchQuery, data, refetch]);

    const renderResults = () => {
        if (loading) return <p>Loading...</p>;
        if (error) return <p>Error :(</p>;

        return <div className="Search-results">
            <ul>
            {searchResults.map(item => (
                <li key={item.id}>
                    <ServiceListingItem service={item}></ServiceListingItem>
                </li>
            ))}
            </ul>
        </div>
    }

    return (
        <div className="Search">
            <Form key="search" inline>
                <FormControl onChange={onSearchChange} type="text" placeholder="Search" value={searchQuery} />
            </Form>

            {renderResults()}
        </div>
    );
}

export default Search;
