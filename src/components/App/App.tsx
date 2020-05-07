import React from 'react';
import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route
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
      uri: 'https://api.test.datacite.org/graphql',
      credentials: 'same-origin'
    })
  ]),
  cache: new InMemoryCache()
});

function App() {
  return (
    <ApolloProvider client={client}>
    <Router>
      <div className="App">
        <header className="App-header">
          <Navbar>
            <LinkContainer to="/">
              <Navbar.Brand data-testid="navbar-brand"><span className="brand-highlight">PID</span> Services Registry</Navbar.Brand>
            </LinkContainer>
            <Nav className="mr-auto">
              <LinkContainer exact to="/">
                <Nav.Link>Home</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/services">
                <Nav.Link>Services</Nav.Link>
              </LinkContainer>
            </Nav>
          </Navbar>
        </header>

        <main role="main" className="App-main flex-shrink-0">
          <div className="container">
          <Switch>
              <Route exact path="/services">
                <Services />
              </Route>
              <Route path="/services/:serviceId+">
                <ServiceOverview />
              </Route>
              <Route exact path="/">
                <Home />
              </Route>
              <Route path="*">
                <Error title="Not found" message="The page you are looking for can not be found." />
              </Route>
          </Switch>
          </div>
        </main>

        <footer className="App-footer py-3">
          <Container>
            <Row>
              <Col sm={6}>
              <p>
                The PID Services Registry is part of the <a href="https://www.project-freya.eu">FREYA project</a> and is maintained by <a href="https://www.datacite.org">DataCite</a>
              </p>
              </Col>
              <Col sm={6}>
                  <p>The FREYA project has received funding from the <a href="https://ec.europa.eu/programmes/horizon2020/en">European Union’s Horizon 2020</a> research and innovation programme under grant agreement No 777523.</p>
              </Col>
            </Row>

          </Container>
        </footer>

      </div>
    </Router>
    </ApolloProvider>
  );
}

function Home() {
  return (
    <div>
      <h2>PID Services Registry</h2>
      <Container className="content">
        <Row>
          <Col>
          <p>Welcome to the PID Services registry.</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur fermentum lacinia ipsum vel varius. In hac habitasse platea dictumst. Maecenas rutrum, ligula vitae commodo egestas, mauris enim commodo purus, vitae ultrices velit risus quis urna. In eu velit ipsum. Pellentesque nec ex eu massa sodales consectetur et ultricies urna. Aliquam finibus, enim sed malesuada rhoncus, mi nisl ullamcorper justo, id interdum dui diam sit amet ipsum. Praesent malesuada quam purus, nec malesuada justo facilisis vitae. Sed vestibulum non est nec facilisis.</p>
          <p>Phasellus lacinia odio dolor, eu sodales sem blandit vitae. Suspendisse sed lacinia ipsum. Suspendisse interdum urna est, ac scelerisque odio molestie in. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Maecenas at nunc lacinia, scelerisque orci non, ornare metus. Morbi sodales turpis a quam vehicula dignissim. Nunc congue cursus est eget convallis. Fusce lobortis lorem augue, sed eleifend velit pretium sit amet. Fusce ut auctor lacus. Duis dictum blandit eros vitae consequat. Aliquam faucibus maximus lacus, ut rhoncus dolor placerat et. Vestibulum ut varius urna. </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

function Services() {
  return (
    <div>
    <h2>Services</h2>
    <Search></Search>
    </div>
  );
}

export default App;
