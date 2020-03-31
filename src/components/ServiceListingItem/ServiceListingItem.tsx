import React from 'react';

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
        <div>
            <h3>{service.name}</h3>
            <p>{service.description}</p>
            <p><a href={service.id}>Access Service</a></p>
            <p>Provided by: {service.creators.join(", ")}</p>
        </div>
    )
}

export default ServiceListingItem;
