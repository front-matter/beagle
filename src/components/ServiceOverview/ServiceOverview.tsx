import './ServiceOverview.css';

import React, { useRef } from 'react';
import groupby from 'lodash.groupby';
import { useQuery, gql } from '@apollo/client';

import { Container, Row, Col, Button, InputGroup, FormControl, ListGroup, Card } from 'react-bootstrap';
import Error from '../Error/Error';
import { Html5Entities } from 'html-entities';

const htmlEntities = new Html5Entities();

export interface ServiceDetailData {
    id: string;
    doi: string;
    name: string;
    tagline: string;
    description: string;
    creators: string[];
    language: string;
    fieldsOfScience: string[];
    pidEntityTypes: string[];
    category: string[];
    tags: string[];
    trl: string;
}

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
        title: string,
        titleType: string
    }];
    descriptions: [{
        description: string,
        descriptionType: string
    }];
    creators: [{
        name: string
    }];
    language: {
        name: string
    };
    subjects: [{
        subject: string,
        subjectScheme: string
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
            title,
            titleType
        }
        descriptions {
            description
            descriptionType
        }
        creators {
            name,
            type,
            affiliation {
              id
            }
        },
    	language {
            name
        }
    	subjects {
          subject,
          subjectScheme,
        },
    }
}
`;

export const ServiceOverview: React.FunctionComponent<Props> = ({ serviceId }) => {
    const inputEl = useRef<HTMLInputElement & FormControl>(null);

    const fullId = (process.env.NODE_ENV === "production") ? "https://doi.org/" + serviceId : "https://handle.test.datacite.org/" + serviceId;

    const [service, setService] = React.useState<ServiceDetailData>();
    const { loading, error, data } = useQuery<ServiceQueryData, ServiceQueryVar>(
        SERVICE_GQL,
        {
            errorPolicy: 'all',
            variables: { id: fullId }
        }
    )

    const copyToClipboard = (e: React.FormEvent<HTMLButtonElement>): void => {

        if (inputEl && inputEl.current) {
            inputEl.current.select();
            document.execCommand('copy');
        }
    };

    React.useEffect(() => {
        let result = undefined;

        if (data) {
            let dataset = data.service;
            let name = "No Title";
            let tagline = "";
            if (dataset.titles.length > 0) {
                name = dataset.titles[0].title;

                let subTitles = dataset.titles.filter(t => t.titleType === "Subtitle");
                if (subTitles.length > 0) {
                    tagline = subTitles[0].title;
                }
            }

            let description = "";
            if (dataset.descriptions.length > 0) {
                description = dataset.descriptions[0].description;
            }
            let creators = [""];
            creators = dataset.creators.map(c => c.name);

            const groupedSubjects = groupby(dataset.subjects, subject => subject.subjectScheme);

            let fieldsOfScience: string[] = [];
            if ("Fields of Science and Technology (FOS)" in groupedSubjects) {
                fieldsOfScience = groupedSubjects["Fields of Science and Technology (FOS)"].map(i => i.subject.replace("FOS: ", ""));
            }

            let pidEntityTypes: string[] = [];
            if ("PidEntity" in groupedSubjects) {
                pidEntityTypes = groupedSubjects["PidEntity"].map(i => i.subject);
            }

            let category: string[] = [];
            if ("ServiceCategory" in groupedSubjects) {
                category = groupedSubjects["ServiceCategory"].map(i => i.subject);
            }

            let tags: string[] = [];
            if ("ServiceTag" in groupedSubjects) {
                tags = groupedSubjects["ServiceTag"].map(i => i.subject);
            }

            let trl = "";
            if ("TRL" in groupedSubjects) {
                trl = groupedSubjects["TRL"].map(i => i.subject)[0];
            }

            result =
            {
                id: dataset.id,
                doi: dataset.doi,
                name: name,
                tagline: tagline,
                description: description,
                creators: creators,
                language: dataset.language.name,
                fieldsOfScience: fieldsOfScience,
                pidEntityTypes: pidEntityTypes,
                category: category,
                tags: tags,
                trl: trl,
            };
        }

        setService(result);
    }, [fullId, data]);

    if (loading) return <p>Loading...</p>;

    if (error) {
        return <Error title="No Service" message="Unable to retrieve service" />
    }

    if (!service) return <p>Service not found.</p>;

    return (
        <div className="ServiceOverview">
            <Container>
                <h2>{service.name} <small className="text-muted">{service.tagline}</small></h2>
                <Row>
                    <Col sm={8}>
                        <p>Provided by: {service.creators.join(", ")}</p>
                        <p>{service.description}</p>
                        <p><Button href={service.id}>Access Service</Button></p>
                    </Col>
                    <Col sm={4}>
                        <Card>
                            <Card.Header>General</Card.Header>
                            <ListGroup>
                                <ListGroup.Item>
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
                                </ListGroup.Item>
                                {service.language &&
                                    <ListGroup.Item>
                                        <strong>Primary language:</strong> {service.language}
                                    </ListGroup.Item>
                                }
                                {service.trl &&
                                    <ListGroup.Item>
                                        <strong>TRL:</strong> {service.trl}
                                    </ListGroup.Item>
                                }
                            </ListGroup>
                        </Card>
                        {service.fieldsOfScience.length > 0 &&
                            <Card>
                                <Card.Header>Scientific Field</Card.Header>
                                <ListGroup variant="flush">
                                    {service.fieldsOfScience.map(item => (
                                        <ListGroup.Item key={item}>
                                            {htmlEntities.decode(item)}
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </Card>
                        }

                        {service.category.length > 0 &&
                            <Card>
                                <Card.Header>Service Category</Card.Header>
                                <ListGroup variant="flush">
                                    {service.category.map(item => (
                                        <ListGroup.Item key={item}>
                                            {htmlEntities.decode(item)}
                                        </ListGroup.Item>
                                    ))
                                    }
                                </ListGroup>
                            </Card>
                        }

                        {service.pidEntityTypes.length > 0 &&
                            <Card>
                                <Card.Header>PID Entity</Card.Header>
                                <ListGroup variant="flush">
                                    {service.pidEntityTypes.map(item => (
                                        <ListGroup.Item key={item}>
                                            {htmlEntities.decode(item)}
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </Card>
                        }

                        {service.tags.length > 0 &&
                            <Card>
                                <Card.Header>Tags</Card.Header>
                                <ListGroup variant="flush">
                                    {service.tags.map(item => (
                                        <ListGroup.Item key={item}>
                                            {htmlEntities.decode(item)}
                                        </ListGroup.Item>
                                    ))
                                    }
                                </ListGroup>
                            </Card>
                        }
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default ServiceOverview;
