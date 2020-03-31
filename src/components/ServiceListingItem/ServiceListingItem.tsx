import React from 'react';

export interface Service {
    id: string,
    name: string;
    description: string;
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
            <p><a href={service.id}>Access Service</a></p>
            <p>Provided by: {service.organization}</p>
        </div>
    )
}

export default ServiceListingItem;
