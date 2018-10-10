import * as React from 'react';
import * as PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button, Dropdown, Form, Input } from 'semantic-ui-react';
import { memberStatus, memberState } from 'lib/selectOptions';

const MembersFilterContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
`;

const ResetButton = styled(Button)`
    &&& {
        margin-top: 10px;
    }
`;

export default class MembersFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchValue: '',
            filter: ''
        };
    }

    keyPressHandler = e => {
        if (e.key === 'Enter') this.searchRequest();
    };

    inputChangeHandler = (e, { value }) => {
        this.setState({ searchValue: value });
    };

    searchRequest = () => {
        const { searchValue, filter } = this.state;
        this.props.search({ query: searchValue, filter });
    };

    filterChangeHandler = (e, { value }) => {
        const searchValue = this.state.searchValue;
        this.props.setFilter({ query: searchValue, filter: value });
        this.setState({ filter: value });
    };

    resetSearch = () => {
        const { setFilter } = this.props;
        setFilter({ filter: 'ALL' });
        this.setState({ searchValue: '' });
    };

    componentDidMount() {
        const { data } = this.props;
        this.setState({ filter: data.filter, searchValue: data.query });
    }

    render() {
        const { data, filterName } = this.props;
        return (
            <React.Fragment>
                <MembersFilterContainer>
                    <Input
                        loading={data.requesting}
                        placeholder="Search..."
                        iconPosition="left"
                        onChange={this.inputChangeHandler}
                        onKeyPress={this.keyPressHandler}
                        action={{ icon: 'search', onClick: this.searchRequest }}
                        value={this.state.searchValue}
                    />
                    <Form.Group>
                        <label>{filterName}: </label>
                        <Dropdown
                            onChange={this.filterChangeHandler}
                            options={
                                filterName === 'State'
                                    ? memberState
                                    : memberStatus
                            }
                            selection
                            value={data.filter}
                        />
                    </Form.Group>
                </MembersFilterContainer>
                <ResetButton onClick={this.resetSearch}>reset</ResetButton>
            </React.Fragment>
        );
    }
}

MembersFilter.propTypes = {
    data: PropTypes.object.isRequired,
    search: PropTypes.func.isRequired,
    setFilter: PropTypes.func,
    filterName: PropTypes.string
};
