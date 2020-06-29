import React from 'react';

import { Container, Row, Col } from 'react-bootstrap';

import './Error.css';

type Props = {
    title: string;
    message: string;
};

const Error: React.FunctionComponent<Props> = ({title, message}) => {
    return (
        <div className="Error">
        <h2>{title}</h2>
        <Container className="content">
          <Row>
            <Col>
            <p>{message}</p>
            </Col>
          </Row>
        </Container>
      </div>
    )
}

export default Error;
