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
    totalCount: number;
    titles: [{
        title: string
    }]
    descriptions: [{
        description: string
    }]
    creators: [{
        name: string
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
    services(repositoryId: "datacite.services", query: $query) {
        nodes {
            id
            titles {
                title
            }
            descriptions {
                description
                descriptionType
            }
            creators {
                name
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
            data.services.nodes.map(dataset =>  {
                let name = "No Title";
                if (dataset.titles.length > 0) {
                    name = dataset.titles[0].title;
                }

                let description = "";
                if (dataset.descriptions.length > 0) {
                    description =  dataset.descriptions[0].description;
                }
                let creators = [""];
                creators = dataset.creators.map(c => c.name);

                results.push(
                    {
                        id: dataset.id,
                        name: name,
                        description: description,
                        creators: creators
                    }
                );

                return results;
                }
            )
        }
        setSearchResults(results);
    }, [searchQuery, data, refetch]);

    const renderResults = () => {
        if (loading) return <p>Loading...</p>;
        if (error) return <p>Error :(</p>;

        return <div className="Search-results">
            <p>Num services: {searchResults.length}</p>
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
