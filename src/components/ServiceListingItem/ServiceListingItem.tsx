import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export interface Service {
    name: string;
    description: string;
    url: string;
    organization: string;
}

type Props = {
    service: Service;
};

type State = {

};

const ServiceListingItem: React.FunctionComponent<Props> = ({service}) => {
    return (
        <div>
            <h3>{service.name}</h3>
            <p>{service.description}</p>
            <p>{service.url}</p>
            <p>{service.organization}</p>
        </div>
    )
}

export default ServiceListingItem;
