import * as React from 'react';
import * as PropTypes from 'prop-types';
import styled from 'styled-components';
import { Card, Image, Dropdown, Button } from 'semantic-ui-react';
import * as moment from 'moment';
import { assetStates } from 'lib/selectOptions';

const CardButtons = styled(Card.Content)`
    &&& {
        box-sizing: border-box;
        max-height: 120px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 120px;
    }
`;

export default class AssetCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dropdownValue: ''
        };
    }

    dropdownHandler = (e, { value }) => {
        this.setState(() => ({ dropdownValue: value }));
    };

    saveClickHandler = () => {
        this.setState(() => ({ disabled: true }));
        this.props.assetUpdate(
            this.props.asset.id,
            this.state.dropdownValue || this.props.asset.state
        );
    };

    componentDidMount() {
        const { memberRequest, asset } = this.props;
        memberRequest(asset.userId);
    }

    render() {
        const { asset, member } = this.props;
        const assetDate = moment(
            asset.registrationDate,
            'YYYY-MM-DD HH:mm'
        ).format('MMMM Do YYYY');
        return (
            <Card>
                <Image src={asset.photoUrl} />
                <Card.Content>
                    <Card.Header>{asset.title}</Card.Header>
                    <Card.Meta>{assetDate}</Card.Meta>
                    <Card.Description>
                        Member: {member && member.firstName}
                    </Card.Description>
                    <Card.Description>
                        Price: {asset.price} SEK
                    </Card.Description>
                    <Card.Description>
                        Purchase date:{' '}
                        {moment(asset.purchaseDate, 'DD/MM/YYYY').format(
                            'MM.DD.YYYY'
                        )}
                    </Card.Description>
                    <Card.Description>
                        <a href={asset.receiptUrl} target="_blank">
                            Receipt
                        </a>
                    </Card.Description>
                </Card.Content>
                <CardButtons>
                    <Dropdown
                        fluid
                        onChange={this.dropdownHandler}
                        options={assetStates}
                        placeholder="Choose asset state"
                        selection
                        value={this.state.dropdownValue || asset.state}
                    />
                    <Button primary fluid onClick={this.saveClickHandler}>
                        Save
                    </Button>
                </CardButtons>
            </Card>
        );
    }
}

AssetCard.propTypes = {
    asset: PropTypes.object.isRequired,
    assetUpdate: PropTypes.func.isRequired,
    member: PropTypes.object,
    memberRequest: PropTypes.func
};
