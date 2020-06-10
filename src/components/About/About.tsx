import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
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
                        More information can be found via the <a href="https://schema.datacite.org/">DataCite Metadata Schema</a> site.
                    </p>
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
                    In addition to the graphql API, because these are registered as DataCite DOIs you may additionally query them using any other existing interface offered, other APIs are documented on the <a href="https://support.datacite.org/docs/api">DataCite support site.</a>

                    <h3>Contact</h3>
                    <p>
                        The PID Services Registry is maintained by DataCite and was developed within the FREYA project.
                    For more information about the registry contact <a href="mailto:support@datacite.org">support@datacite.org</a>
                    </p>
                </Col>
            </Row>
        </Container>
    )
}

export default About;
