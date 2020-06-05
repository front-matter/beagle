import React from 'react';
import { FormControlProps } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import ServiceListingItem from '../ServiceListingItem/ServiceListingItem';
import Error from '../Error/Error';

import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { Service } from '../types';

import './Search.css';
import { Container, Row, Col, Badge, ListGroup } from 'react-bootstrap';

type Props = {

};

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
    cursor: string;
}

export const SERVICES_GQL = gql`
query getServicesQuery($query: String!, $cursor: String) {
    services(first: 25, query: $query, after: $cursor, repositoryId: "datacite.services") {
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

export const Search: React.FunctionComponent<Props> = () => {
    const [searchQuery, setSearchQuery] = React.useState("");
    const [searchResults, setSearchResults] = React.useState<Service[]>([]);
    const { loading, error, data, refetch, fetchMore } = useQuery<ServiceQueryData, ServiceQueryVar>(
        SERVICES_GQL,
        {
            errorPolicy: 'all',
            variables: {
                query: "", cursor: ""
            }
        })

    const onSearchChange = (e: React.ChangeEvent<FormControl & HTMLInputElement>): void => {
        if (e.currentTarget.value && typeof e.currentTarget.value === 'string') {
            setSearchQuery(e.currentTarget.value);
        }
    };

    const loadMore = (cursor: String) => {
        fetchMore(
            {
                variables: { cursor: cursor },
                updateQuery: (previousResult: ServiceQueryData, { fetchMoreResult }) => {
                    if (!fetchMoreResult) { return previousResult; }

                    const newEdges = fetchMoreResult.services.edges;
                    const pageInfo = fetchMoreResult.services.pageInfo;
                    const pidEntities = fetchMoreResult.services.pidEntities;
                    const fieldsOfScience = fetchMoreResult.services.fieldsOfScience;
                    const totalCount = fetchMoreResult.services.totalCount;

                    return newEdges.length
                        ? {
                            services: {
                                __typename: previousResult.services.__typename,
                                edges: [...previousResult.services.edges, ...newEdges],
                                pageInfo,
                                pidEntities,
                                fieldsOfScience,
                                totalCount,
                            }
                        }
                        : previousResult;
                }
            })
    }

    React.useEffect(() => {
        const typingDelay = setTimeout(() => {
            console.log(searchQuery)
            refetch({ query: searchQuery, cursor: "" })
        }, 300)

        const results: Service[] = [];
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
            }
            )
        }
        setSearchResults(results);

        return () => clearTimeout(typingDelay)
    }, [searchQuery, data, refetch]);

    const renderResults = () => {
        if (loading) return <p>Loading...</p>;

        if (error) return <Error title="Something went wrong." message="Unable to load services." />;

        if (!data) return '';

        return (
            <div className="Search-results">
                <p>Num services: {data.services.totalCount}</p>
                {/* <ul onScroll={onScroll}> */}
                <ul>
                    {searchResults.map(item => (
                        <li key={item.id}>
                            <ServiceListingItem service={item}></ServiceListingItem>
                        </li>
                    ))}
                </ul>

                {data.services.pageInfo.hasNextPage &&
                    <div>
                        <Button variant="secondary" onClick={() => loadMore(data.services.pageInfo.endCursor)} block>Show more</Button>
                    </div>
                }
            </div>
        )
    }

    const renderFilters = () => {
        if (!data) return '';

        return (
            <div className="Search-filters">
                <ListGroup>
                    <h5>PID Types</h5>
                    {data.services.pidEntities.map(item => (
                        <ListGroup.Item key={item.id}>{item.id}<Badge pill variant="secondary">{item.count}</Badge></ListGroup.Item>
                    ))}
                </ListGroup>

                <ListGroup>
                    <h5>Disciplines</h5>
                    {data.services.fieldsOfScience.map(item => (
                        <ListGroup.Item key={item.id}>{item.title}<Badge pill variant="secondary">{item.count}</Badge></ListGroup.Item>
                    ))}
                </ListGroup>
            </div>
        )
    }

    return (
        <div className="Search">
            <Form key="search" className="Search-input">
                <FormControl onChange={onSearchChange} size="lg" type="text" placeholder="Search" value={searchQuery} />
            </Form>

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
        </div>
    );
}

export default Search;
