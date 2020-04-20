import React from 'react';
import { Card } from 'react-bootstrap';

import './ServiceListingItem.css';

export interface Service {
    id: string,
    name: string;
    description: string;
    creators: string[];
}

type Props = {
    service: Service;
};

type State = {

};

const ServiceListingItem: React.FunctionComponent<Props> = ({service}) => {
    return (
        <Card>
            <Card.Body>
            <Card.Title>{service.name}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{service.creators.join(", ")}</Card.Subtitle>
            <Card.Text>
                <p>{service.description}</p>
            </Card.Text>
            <Card.Link href="{service.id}">Access Service</Card.Link>
            </Card.Body>
        </Card>
    )
}

export default ServiceListingItem;
