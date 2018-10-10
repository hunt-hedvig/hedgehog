import * as React from 'react';
import * as PropTypes from 'prop-types';
import styled from 'styled-components';
import { Breadcrumb } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { getMemberInfo } from 'lib/helpers';

const BreadcrumbsContainer = styled.div`
    display: flex;
    margin: 20px;
`;

const Breadcrumbs = ({ state }) => {
    // eslint-disable-next-line no-undef
    const pathname = window.location.pathname;
    const paths = pathname.split('/').map((path, i, arr) => {
        if (i === 0) {
            return {
                key: i,
                content: <Link to={'/dashboard'}>dashborad</Link>,
                active: true
            };
        }

        if (i === arr.length - 1) {
            const content =
                pathname.indexOf('members/') >= 0
                    ? getMemberInfo(state.members.list, path)
                    : path.toLowerCase();
            return {
                key: i,
                content: content,
                active: false
            };
        }

        return {
            key: i,
            content: (
                <Link to={`${arr.slice(0, i + 1).join('/')}`}>
                    {path.toLowerCase()}
                </Link>
            ),
            active: true
        };
    });
    return (
        <BreadcrumbsContainer>
            <Breadcrumb sections={paths} />
        </BreadcrumbsContainer>
    );
};

Breadcrumbs.propTypes = {
    state: PropTypes.object
};

export default Breadcrumbs;
