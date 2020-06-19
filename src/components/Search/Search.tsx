import React from 'react';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import { ServiceListingData, ServiceListingItem } from '../ServiceListingItem/ServiceListingItem';
import Error from '../Error/Error';
import { useQueryState } from "use-location-state";
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import './Search.css';
import { Container, Row, Col, Badge, ListGroup, InputGroup } from 'react-bootstrap';

interface ServiceQueryResult {
    id: string;
    doi: string;
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

interface PageInfo {
    endCursor: string;
    hasNextPage: boolean;
}

interface ServiceEdge {
    node: ServiceQueryResult
}

interface Facet {
    count: number;
    id: string;
    title: string;
}

interface ServiceQueryData {
    services: {
        __typename: String;
        edges: ServiceEdge[];
        pageInfo: PageInfo;
        pidEntities: Facet[];
        fieldsOfScience: Facet[];
        totalCount: Number;
    },
}

interface ServiceQueryVar {
    query: string;
    pidEntity: string;
    fieldOfScience: string;
}

export const SERVICES_GQL = gql`
query getServicesQuery($query: String!, $pidEntity: String, $fieldOfScience: String) {
    services(query: $query, repositoryId: "datacite.services", pidEntity: $pidEntity, fieldOfScience: $fieldOfScience) {
        edges {
            node {
                id
                doi
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
        },
        pageInfo {
            endCursor,
            hasNextPage
        },
        pidEntities {
            id
            title
            count
        },
        fieldsOfScience {
            id
            title
            count
        },
        totalCount
    }
}
`;

export const Search: React.FunctionComponent = () => {
    const [searchQuery, setSearchQuery] = useQueryState("search", "");
    const [finalSearchQuery, setFinalSearchQuery] = React.useState("");

    const onSearchChange = (e: React.ChangeEvent<FormControl & HTMLInputElement>): void => {
        setSearchQuery(e.currentTarget.value);
    };

    const onReset = (e: React.MouseEvent<FormControl & HTMLButtonElement>) => {
        setSearchQuery("");
    };

    const handleSearch = () => {
        setFinalSearchQuery(searchQuery);
    }

    return (
        <div className="Search">
            <Form key="search" className="Search-input" onSubmit={handleSearch}>
                <InputGroup>
                    <FormControl onChange={onSearchChange} size="lg" type="text" placeholder="Search" value={searchQuery} />
                    <Button variant="secondary" type="submit">Search</Button>
                    <button onClick={onReset} className="btn bg-transparent reset">
                        <i className="fa fa-times"></i>
                    </button>
                </InputGroup>
            </Form>

            <SearchResults searchQuery={finalSearchQuery}></SearchResults>
        </div>
    );
}

type Props = {
    searchQuery: string
};

export const SearchResults: React.FunctionComponent<Props> = (props) => {
    const [pidTypes, setPidTypes] = useQueryState<string[]>("pidtypes", []);
    const [disciplines, setDisciplines] = useQueryState<string[]>("disciplines", []);
    const [searchResults, setSearchResults] = React.useState<ServiceListingData[]>([]);

    const { loading, error, data, refetch, fetchMore } = useQuery<ServiceQueryData, ServiceQueryVar>(
        SERVICES_GQL,
        {
            errorPolicy: 'all',
            variables: {
                query: props.searchQuery, pidEntity: pidTypes.toString(), fieldOfScience: disciplines.toString()
            }
        })

    const toggleFilters = (filters: string[], setFunc: Function, id: string) => {
        const activeFilters = filters.filter(t => t !== id);
        setFunc(
            filters.includes(id) ? activeFilters : [...filters, id]
        );
    };

    const resetFilters = (e: React.MouseEvent<FormControl & HTMLButtonElement>) => {
        setDisciplines([]);
        setPidTypes([]);
    };

    React.useEffect(() => {
        refetch({ query: props.searchQuery, pidEntity: pidTypes.toString(), fieldOfScience: disciplines.toString() });

        const results: ServiceListingData[] = [];
        if (data) {
            data.services.edges.map(edge => {
                let dataset = edge.node;
                let name = "No Title";
                if (dataset.titles.length > 0) {
                    name = dataset.titles[0].title;
                }

                let description = "";
                if (dataset.descriptions.length > 0) {
                    description = dataset.descriptions[0].description;
                }
                let creators = [""];
                creators = dataset.creators.map(c => c.name);

                results.push(
                    {
                        id: dataset.id,
                        doi: dataset.doi,
                        name: name,
                        description: description,
                        creators: creators
                    }
                );

                return results;
            })

            setSearchResults(results);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.searchQuery, data, refetch]);

    const renderResults = () => {
        if (loading) return <p>Loading...</p>;

        if (error) return <Error title="Something went wrong." message="Unable to load services." />;

        if (!data) return '';

        return (
            <div className="Search-results">
                <p>Num services: {data.services.totalCount}</p>
                <ul>
                    {searchResults.map(item => (
                        <li key={item.id}>
                            <ServiceListingItem service={item}></ServiceListingItem>
                        </li>
                    ))}
                </ul>
            </div>
        )
    }

    const renderFilters = () => {
        if (!data) return '';

        return (
            <div className="Search-filters">
                <div>
                    <h4>Filters</h4>
                    <Button onClick={resetFilters} variant="link" className="p-0">
                        <i className="fa fa-times"> Reset</i>
                    </Button>
                </div>
                {data.services.pidEntities.length > 0 &&
                    <ListGroup>
                        <h5>PID Types</h5>
                        {data.services.pidEntities.map(item => (
                            <ListGroup.Item action key={item.id} active={pidTypes.includes(item.id)} onClick={() => toggleFilters(pidTypes, setPidTypes, item.id)}>{item.title}<Badge pill variant="secondary">{item.count}</Badge></ListGroup.Item>
                        ))}
                    </ListGroup>
                }

                {data.services.fieldsOfScience.length > 0 &&
                    <ListGroup>
                        <h5>Disciplines</h5>
                        {data.services.fieldsOfScience.map(item => (
                            <ListGroup.Item action key={item.id} active={disciplines.includes(item.id)} onClick={() => toggleFilters(disciplines, setDisciplines, item.id)}>{item.title}<Badge pill variant="secondary">{item.count}</Badge></ListGroup.Item>
                        ))}
                    </ListGroup>
                }
            </div>
        )
    }

    return (

        <Container>
            <Row>
                <Col xs={4}>
                    {renderFilters()}
                </Col>
                <Col xs={8}>
                    {renderResults()}
                </Col>
            </Row>
        </Container>
    );
}

export default Search;
