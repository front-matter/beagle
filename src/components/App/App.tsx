import React from 'react';
import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { LinkContainer } from 'react-router-bootstrap';

import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

import Search from '../Search/Search';

const client = new ApolloClient({
  uri: 'https://api.test.datacite.org/graphql',
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

        <Switch>
          <Route path="/services">
            <Services />
          </Route>
          <Route exact path="/">
            <Home />
          </Route>
        </Switch>
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
