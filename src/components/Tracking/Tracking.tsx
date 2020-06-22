import React from 'react';
import { useEffect } from 'react'
import ReactGA from 'react-ga';
import { useHistory } from 'react-router-dom'

if (['production'].includes(process.env.NODE_ENV)) {
    ReactGA.initialize(process.env.REACT_APP_GA_ANALYTICS_UA || '');
    ReactGA.pageview(window.location.pathname + window.location.search);
}

type Props = {

};

export const Tracking: React.FunctionComponent<Props> = (props) => {
    const history = useHistory()

    useEffect(() => {
        const unlisten = history.listen((location) => {
            ReactGA.set({ page: location.pathname }); // Update the user's current page
            ReactGA.pageview(location.pathname); // Record a pageview for the given page
        })

        return unlisten
    }, [history])

    return null;
}

export default Tracking;
