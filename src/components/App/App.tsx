import React from 'react';
import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams
} from "react-router-dom";
import { LinkContainer } from 'react-router-bootstrap';

import { ApolloProvider } from '@apollo/react-hooks';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';

import { Container, Row, Col, Navbar, Nav } from 'react-bootstrap';
import Search from '../Search/Search';
import ServiceOverview from '../ServiceOverview/ServiceOverview';
import Error from '../Error/Error';
import About from '../About/About';

const client = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.forEach(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
          ),
        );
      if (networkError) console.log(`[Network error]: ${networkError}`);
    }),
    new HttpLink({
      uri: process.env.REACT_APP_GRAPHQL_API_URL,
      credentials: 'same-origin'
    })
  ]),
  cache: new InMemoryCache()
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <header className="App-header">
          <Navbar>
            <LinkContainer to="/">
              <Navbar.Brand data-testid="navbar-brand"><span className="brand-highlight">PID</span> Services Registry</Navbar.Brand>
            </LinkContainer>
            <LinkContainer to="/">
              <Nav.Link>Services</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/about">
              <Nav.Link>About</Nav.Link>
            </LinkContainer>
          </Navbar>
          <div className="App-header-content">
            <Container>
              <Row>
                <Col>
                  <h1>Welcome to the PID Services registry.</h1>
                  <p>
                    This registry provides an overview of services related to Persistent Identifiers (PIDs). The PID Services Registry is maintained by DataCite and was developed within the FREYA project.
                  For more information about the registry contact <a href="mailto:support@datacite.org">support@datacite.org</a>
                  </p>
                </Col>
              </Row>
            </Container>
          </div>
        </header>

        <main role="main">
          <Container>
            <Switch>
              <Route exact path="/">
                <Services />
              </Route>
              <Route path="/services/:serviceId+">
                <Service />
              </Route>
              <Route exact path="/about">
                <About />
              </Route>
              <Route path="*">
                <Error title="Not found" message="The page you are looking for can not be found." />
              </Route>
            </Switch>
          </Container>
        </main>

        <footer className="App-footer py-3">
          <Container>
            <Row>
              <Col sm={6}>
                <p>
                  The PID Services Registry is maintained by <a href="https://www.datacite.org">DataCite</a> and was developed within the <a href="https://www.project-freya.eu">FREYA project</a> .
                </p>
                <p>
                  <img src="/freya_logo.png" width="100" alt="FREYA" />
                  <img src="/eosc_logo-trs.png" width="200" alt="FREYA" />
                </p>
              </Col>
              <Col sm={6}>
                <p>The FREYA project has received funding from the <a href="https://ec.europa.eu/programmes/horizon2020/en">European Union’s Horizon 2020</a> research and innovation programme under grant agreement No 777523.</p>
              </Col>
            </Row>
          </Container>
        </footer>
      </Router>
    </ApolloProvider>
  );
}

function Services() {
  return (
    <Search></Search>
  );
}

function Service() {
  let { serviceId } = useParams();

  return (
    <ServiceOverview serviceId={serviceId} />
  )
}

export default App;
