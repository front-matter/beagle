import React from 'react';
import { Container, Row, Col, Table } from 'react-bootstrap';
import SyntaxHighlighter from 'react-syntax-highlighter';

const exampleGraphqlQuery =
    `query {
    services(first: 25, repositoryId: "datacite.services") {
        nodes {
            id
            doi
            titles {
                title
            }
        }
    }
}
`

const About: React.FunctionComponent = () => {
    return (
        <Container>
            <Row>
                <Col>
                    <h1>About the PID Services registry.</h1>
                    <p>
                        This registry provides an overview of services related to Persistent Identifiers (PIDs).
                    </p>
                    <h3>Metadata</h3>
                    <p>
                        All services are registered as a <a href="https://doi.org">DOI</a> provided by <a href="https://www.datacite.org">DataCite</a> and uses the associated DataCite metadata schema to describe the services.
                        More information can be found from the <a href="https://schema.datacite.org/">DataCite Metadata Schema</a> site.
                    </p>
                    <p>Below is a table that describes the important mapping of metadata used in the PID Services Registry.</p>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Field</th><th>DataCite MetaData</th><th>Guidance</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td>PID Type</td><td>Subject</td><td>subjectScheme="PidEntity" with values of: Publication, Citation, Conference, Researcher, Organization, Data, DataRepository, Grants, Project, Experiment, Investigation, Analysis, Software, Computer Simulation, Software License, Equipment, Sample</td></tr>
                            <tr><td>Service Provider Name</td><td>Creator/CreatorName</td><td>creatorName with nameType=Organizational</td></tr>
                            <tr><td>Service Provider URL</td><td>Creator/NameIdentifier</td><td>A <a href="https://ror.org/">ROR Identifier</a></td></tr>
                            <tr><td>Service Name</td><td>Title</td><td>First title will be used</td></tr>
                            <tr><td>Service Description</td><td>Description</td><td>First description will be used</td></tr>
                            <tr><td>Service Language</td><td>Language</td><td>ISO 639-1 language codes</td></tr>
                            <tr><td>Geographic Availability</td><td>GeolocationPlace</td><td>Worldwide, region e.g. Europe or ISO Country Codes</td></tr>
                            <tr><td>Service Tagline</td><td>Title</td><td>type="Subtitle"</td></tr>
                            <tr><td>Service Category</td><td>Subject</td><td>subjectScheme="ServiceCategory" with values of: Service &amp; Discovery, Processing &amp; Analysis, Compute, Storage, Data Management, Networking, Training and Support, Security and Operations</td></tr>
                            <tr><td>Service Tags</td><td>Subject</td><td>subjectScheme="ServiceTag"</td></tr>
                            <tr><td>Scientific Fields</td><td>Subject</td><td>subjectScheme="Fields of Science and Technology (FOS)", values based on <a href="http://www.oecd.org/science/inno/38235147.pdf">OECD</a></td></tr>
                            <tr><td>TRL</td><td>Subject</td><td>subjectScheme="TRL"</td></tr>
                        </tbody>
                    </Table>
                    <h3>API</h3>
                    <p>
                        This registry interface is built on top of the <a href="https://support.datacite.org/docs/datacite-graphql-api-guide">GraphQL API</a> that was built as part of the FREYA Project.
                    This means you can query using any GraphQL client to obtain details of the registered services. Here is an example query:</p>
                    <code>
                        <SyntaxHighlighter language="javascript">
                            {exampleGraphqlQuery}
                        </SyntaxHighlighter>
                    </code>

                    <p>An important thing to realise here is that all services are registered under the repository <strong>"datacite.services"</strong>, without this it will return all services registered regardless if they are related to PID Services.</p>

                    <h4>More</h4>
                    <p>In addition to the GraphQL API, because these are registered as DataCite DOIs you may additionally query them using any other existing interface offered, other APIs are documented on the <a href="https://support.datacite.org/docs/api">DataCite support site.</a></p>

                    <h3>Contact</h3>
                    <p>
                        The PID Services Registry is maintained by DataCite and was developed within the FREYA project.
                    For more information about the registry contact <a href="mailto:support@datacite.org">support@datacite.org</a>
                    </p>
                </Col>
            </Row>
        </Container >
    )
}

export default About;
