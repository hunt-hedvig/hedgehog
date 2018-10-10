import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router';
import { checkApiAuth } from '../lib/checkAuth';

const PrivateRoute = ({ component: Component, store, ...rest }) => {
    return (
        <Route
            {...rest}
            render={props =>
                checkApiAuth(store) ? (
                    <Component {...props} />
                ) : (
                    <Redirect
                        to={{
                            pathname: '/login/oauth',
                            state: { from: props.location }
                        }}
                    />
                )
            }
        />
    );
};

PrivateRoute.propTypes = {
    component: PropTypes.func.isRequired,
    store: PropTypes.object.isRequired,
    location: PropTypes.object
};

export default PrivateRoute;
