import React from 'react';
import {
    useParams
} from "react-router-dom";
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import { Card } from 'react-bootstrap';
import { Service } from '../Search/Search';

import './ServiceOverview.css';

interface ParamTypes {
    serviceId: string
}

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

interface ServiceQueryData {
    service: ServiceQueryResult
}

interface ServiceQueryVar {
    id: string;
}

const SERVICE_GQL = gql`
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

const ServiceOverview: React.FunctionComponent = () => {
    let { serviceId } = useParams<ParamTypes>();

    const fullId = (process.env.NODE_ENV === "production") ? "https://doi.org/" + serviceId : "https://handle.test.datacite.org/" + serviceId;

    const [service, setService] = React.useState<Service>();
    const { loading, error, data, refetch } = useQuery<ServiceQueryData, ServiceQueryVar>(
        SERVICE_GQL,
        {
            errorPolicy: 'all',
            variables: { id: fullId
        }
    })


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
    if (error) return <p>Error :(</p>;

    if (!service ) return <p>Service not found.</p>;

    return (
        <div>
            <a href="/services">Services</a>
            <h1>Service ID: {serviceId}</h1>
            <Card>
                <Card.Body>
                <Card.Title>{service.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{service.creators.join(", ")}</Card.Subtitle>
                <Card.Text>
                    {service.description}
                </Card.Text>
                <Card.Link href={service.id}>Access Service</Card.Link>
                </Card.Body>
            </Card>
        </div>
    )
}

export default ServiceOverview;
