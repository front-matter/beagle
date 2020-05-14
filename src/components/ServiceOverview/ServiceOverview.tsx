import React, { useRef } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { Container, Row, Col, Button, InputGroup, FormControl } from 'react-bootstrap';
import { Service } from '../types';
import Error from '../Error/Error';

import './ServiceOverview.css';

type Props = {
    serviceId?: string;
};

interface ParamTypes {
    serviceId: string
}

interface ServiceQueryResult {
    id: string;
    doi: string;
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
    service: ServiceQueryResult
}

interface ServiceQueryVar {
    id: string;
}

export const SERVICE_GQL = gql`
query getServiceQuery($id: ID!) {
    service(id: $id) {
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
}
`;

export const ServiceOverview: React.FunctionComponent<Props> = ({serviceId}) => {
    const inputEl = useRef<HTMLInputElement & FormControl>(null);

    const fullId = (process.env.NODE_ENV === "production") ? "https://doi.org/" + serviceId : "https://handle.test.datacite.org/" + serviceId;

    const [service, setService] = React.useState<Service>();
    const { loading, error, data, refetch } = useQuery<ServiceQueryData, ServiceQueryVar>(
        SERVICE_GQL,
        {
            errorPolicy: 'all',
            variables: { id: fullId
        }
    })

    const copyToClipboard = (e: React.FormEvent<HTMLButtonElement>): void => {

        if(inputEl && inputEl.current) {
            inputEl.current.select();
            document.execCommand('copy');
        }
    };

    React.useEffect(() => {
        refetch({ id: fullId})

        let result = undefined;

        if(data) {
            let dataset = data.service;
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

            result =
            {
                id: dataset.id,
                doi: dataset.doi,
                name: name,
                description: description,
                creators: creators
            };
        } else {

        }
        setService(result);
    }, [fullId, data, refetch]);

    if (loading) return <p>Loading...</p>;

    if (error) {
        return <Error title="No Service" message="Unable to retrieve service" />
    }

    if (!service ) return <p>Service not found.</p>;

    return (
        <div className="ServiceOverview">
            <h2>{service.name}</h2>
            <Container className="content">
                <Row>
                    <Col sm={8}>
                        {service.description}
                    </Col>
                    <Col className="text-right" sm={4}>
                        <ul>
                            <li><Button href={service.id}>Access Service</Button></li>
                            <li>
                                <InputGroup>
                                <InputGroup.Prepend><InputGroup.Text>DOI:</InputGroup.Text></InputGroup.Prepend>
                                <FormControl
                                value={service.doi}
                                ref={inputEl}
                                readOnly
                                aria-label="doi"
                                aria-describedby="doi"
                                />
                                <InputGroup.Append>
                                    <Button onClick={copyToClipboard} variant="outline-secondary">Copy</Button>
                                </InputGroup.Append>
                            </InputGroup>
                            </li>
                        </ul>
                    </Col>
                </Row>
                <Row>
                    <Col>Provided by: {service.creators.join(", ")}</Col>
                </Row>
            </Container>
        </div>
    )
}

export default ServiceOverview;
