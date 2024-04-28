import React from 'react';

import { useAppContext } from "./AppProvider";
import ErrorPage from "./pages/ErrorPage";


export default function PageManager({ children }) {
    const { data, setData } = useAppContext();
    if (data == null) return 'Waiting...'

    const currentPage = React.Children.map(children, child => {
        if (child.props.name == window.location.pathname) {
            if (child.props['authReq']) {
                if (data.hasOwnProperty('user')) return child;
                else window.location.href = '/';
            } else return child;
        }
    });

    return (currentPage.length == 0) ? <ErrorPage errorInfo={{'code': 404, 'message': 'Page Not Found'}} /> : currentPage;
}
