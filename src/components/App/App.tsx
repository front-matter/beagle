import React from 'react';
import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { LinkContainer } from 'react-router-bootstrap';
import Image from 'react-bootstrap/Image'

import { ApolloProvider } from '@apollo/react-hooks';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

import Search from '../Search/Search';

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
          <Navbar bg="dark" variant="dark">
            <LinkContainer to="/">
              <Navbar.Brand>PID Services Registry</Navbar.Brand>
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
              <Route path="/services">
                <Services />
              </Route>
              <Route exact path="/">
                <Home />
              </Route>
          </Switch>
          </div>
        </main>

        <footer className="App-footer mt-auto py-3">
          <div className="container text-muted">
            <div className="row">
              <div className="col-sm-6">
              <p>
                The PID Services Registry is part of the <a href="https://www.project-freya.eu">FREYA project</a> and is maintained by <a href="https://www.datacite.org">DataCite</a>
              </p>
              </div>
              <div className="col-sm-6">
                  <p>The FREYA project has received funding from the <a href="https://ec.europa.eu/programmes/horizon2020/en">European Union’s Horizon 2020</a> research and innovation programme under grant agreement No 777523.</p>
              </div>
            </div>

          </div>
        </footer>

      </div>
    </Router>
    </ApolloProvider>
  );
}

function Home() {
  return <h2>Home</h2>;
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
