import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import * as Sentry from '@sentry/browser';
import App from './components/App/App';
import * as serviceWorker from './serviceWorker';

if (['production', 'test'].includes(process.env.NODE_ENV)) {
    Sentry.init({dsn: process.env.SENTRY_DSN });
}

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
