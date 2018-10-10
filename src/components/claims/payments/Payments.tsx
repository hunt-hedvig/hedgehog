import * as React from 'react';
import * as PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button, Form, Segment } from 'semantic-ui-react';
import PaymentsList from './PaymentsList';
import { getSum } from 'lib/helpers';

const Label = styled.label`
    display: flex;
    align-items: center;
    font-weight: 700;
    font-size: 13px;
`;
export default class Payments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            reserve: '',
            editDisabled: true
        };
    }

    editClickHandler = () => {
        this.setState({ editDisabled: false });
    };

    updateReserve = () => {
        const { id, updateReserve, claimDetails } = this.props;

        updateReserve(id, { amount: this.state.reserve }, claimDetails.userId);
        this.setState({
            editDisabled: true
        });
    };

    reserveChangeHandler = (e, { value }) => {
        this.setState({ reserve: value });
    };

    componentWillReceiveProps({ claimDetails: { data } }) {
        if (data && data.reserve) {
            this.setState({ reserve: data.reserve });
        }
    }

    render() {
        const { claimDetails } = this.props;
        const { reserve, editDisabled } = this.state;
        const sum = getSum(claimDetails.payments);
        return (
            <Segment>
                <Form>
                    <Form.Group>
                        <Label>Reserves: </Label>
                        <Form.Input
                            type="number"
                            value={reserve}
                            disabled={editDisabled}
                            onChange={this.reserveChangeHandler}
                        />

                        {editDisabled ? (
                            <Button
                                onClick={this.editClickHandler}
                                content="Edit"
                            />
                        ) : (
                            <Button
                                primary
                                onClick={this.updateReserve}
                                content="Save"
                            />
                        )}
                    </Form.Group>
                </Form>

                <PaymentsList
                    {...this.props}
                    list={claimDetails.payments}
                    sum={sum}
                />
            </Segment>
        );
    }
}

Payments.propTypes = {
    claimDetails: PropTypes.object.isRequired,
    updateReserve: PropTypes.func.isRequired,
    createPayment: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    notes: PropTypes.array
};
