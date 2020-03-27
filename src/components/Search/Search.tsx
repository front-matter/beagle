import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import { Service } from '../ServiceListingItem/ServiceListingItem';
import ServiceListingItem from '../ServiceListingItem/ServiceListingItem';

type Props = {

};

const exampleService: Service = {
    name: "Example service",
    description: "Exampe description of the service.",
    url: "http://example.com",
    organization: "Example Inc"
}

const Search: React.FunctionComponent<Props> = () => {
    return (
        <div>
            <Form inline>
                <FormControl type="text" placeholder="Search" />
                <Button variant="outline-success">Search</Button>
            </Form>
            <h2>Services</h2>
            <ServiceListingItem service={exampleService}></ServiceListingItem>
            <ServiceListingItem service={exampleService}></ServiceListingItem>
        </div>
    );
}

export default Search;
