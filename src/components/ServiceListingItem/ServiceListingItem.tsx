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

class ServiceListingItem extends React.Component<Props, State> {

    render() {
        return (
        <div>
            <h3>{this.props.service.name}</h3>
            <p>{this.props.service.description}</p>
            <p>{this.props.service.url}</p>
            <p>{this.props.service.organization}</p>
        </div>
        );
    }
}

export default ServiceListingItem;
