import React from 'react';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import { Service } from '../ServiceListingItem/ServiceListingItem';
import ServiceListingItem from '../ServiceListingItem/ServiceListingItem';
import './Search.css';

type Props = {

};

const exampleService: Service = {
    id: "1",
    name: "Example service",
    description: "Exampe description of the service.",
    url: "http://example.com",
    organization: "Example Inc"
};

const exampleServices = [
    exampleService,
    {
        id: "2",
        name: "PID services registry",
        description: "Exampe description of the service.",
        url: "http://example.com",
        organization: "Example Inc"
    }
];

const Search: React.FunctionComponent<Props> = () => {
    const [searchQuery, setSearchQuery] = React.useState("");
    const [searchResults, setSearchResults] = React.useState<Service[]>([]);

    const onSearchChange = (e: React.FormEvent<HTMLInputElement>): void => {
        setSearchQuery(e.currentTarget.value);
    };

    React.useEffect(() => {
        const results = exampleServices.filter(service =>
          service.name.toLowerCase().includes(searchQuery)
        );
        setSearchResults(results);
    }, [searchQuery]);

    return (
        <div className="Search">
            <Form inline>
                <FormControl onChange={onSearchChange} type="text" placeholder="Search" value={searchQuery} />
            </Form>
            <div className="Search-results">
                <ul>
                {searchResults.map(item => (
                    <li key={item.id}>
                        <ServiceListingItem service={item}></ServiceListingItem>
                    </li>
                ))}
                </ul>
            </div>
        </div>
    );
}

export default Search;
