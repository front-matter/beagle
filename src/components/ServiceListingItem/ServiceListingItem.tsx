import React from 'react';
import { Card } from 'react-bootstrap';
import { Service } from '../Search/Search';
import './ServiceListingItem.css';

type Props = {
    service: Service;
};

type State = {

};

const ServiceListingItem: React.FunctionComponent<Props> = ({service}) => {
    return (
        <Card>
            <Card.Body>
            <Card.Title><a href={"/services/" + service.doi}>{service.name}</a></Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{service.creators.join(", ")}</Card.Subtitle>
            <Card.Text>
                {service.description}
            </Card.Text>
            <Card.Link href={service.id}>Access Service</Card.Link>
            </Card.Body>
        </Card>
    )
}

export default ServiceListingItem;
