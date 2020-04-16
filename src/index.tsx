import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import * as Sentry from '@sentry/browser';
import App from './components/App/App';
import * as serviceWorker from './serviceWorker';

Sentry.init({dsn: "https://d9c7b78cf2b343198abc57028e432c70@o239790.ingest.sentry.io/5202325"});

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
