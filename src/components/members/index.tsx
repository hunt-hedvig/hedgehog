import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Header } from 'semantic-ui-react';
import MembersList from './members-list/MembersList';
import MembersFilter from './members-filter/MembersFilter';

export default class Members extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { members: { filter, query }, searchMemberRequest } = this.props;
        searchMemberRequest({ query, filter });
    }

    render() {
        const { members, setFilter, searchMemberRequest } = this.props;
        return (
            <React.Fragment>
                <Header size="huge">Members</Header>
                <MembersFilter
                    data={members}
                    setFilter={setFilter}
                    search={searchMemberRequest}
                    filterName="Status"
                />
                <MembersList {...this.props} />
            </React.Fragment>
        );
    }
}

Members.propTypes = {
    members: PropTypes.object.isRequired,
    membersRequest: PropTypes.func.isRequired,
    setFilter: PropTypes.func.isRequired,
    searchMemberRequest: PropTypes.func.isRequired
};
