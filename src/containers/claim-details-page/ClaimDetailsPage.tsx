import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import ClaimDetails from 'components/claims/claim-details';
import actions from 'store/actions';

const ClaimDetailsPage = props => <ClaimDetails {...props} />;

const mapStateToProps = ({ claimDetails, claims, messages }) => ({
    claimDetails,
    types: claims.types,
    member: messages.member
});

export default withRouter(
    connect(mapStateToProps, {
        ...actions.claimDetailsActions,
        ...actions.notesActions,
        ...actions.paymentActions,
        memberRequest: actions.messagesActions.memberRequest,
        claimTypes: actions.claimsActions.claimTypes
    })(ClaimDetailsPage)
);
