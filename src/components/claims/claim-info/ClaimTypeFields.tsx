import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Button, Form, List } from 'semantic-ui-react';
import ClaimInfoField from 'components/claims/claim-info/ClaimInfoField';
import { FormSelect } from 'components/claims/claim-info/ClaimInfo';
import {
    updateTypesList,
    getActiveType,
    getClaimFieldsData
} from 'lib/helpers';

export default class ClaimTypeFields extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fieldsData: {
                optionalData: [],
                requiredData: []
            },
            type: null
        };
    }

    inputHandler = (fieldType, fieldName, input, e, { value }) => {
        const { fieldsData, type } = this.state;
        const newState = getClaimFieldsData(
            fieldsData[fieldType],
            type[fieldType],
            fieldName,
            value
        );
        const cleanedFields = fieldsData[fieldType].filter(
            item => item.name !== fieldName
        );
        this.setState({
            fieldsData: {
                ...fieldsData,
                [fieldType]: value.length ? newState : cleanedFields
            }
        });
    };

    submitTypeChanges = () => {
        const { claimId, claimDetailsUpdate } = this.props;
        const { fieldsData } = this.state;
        claimDetailsUpdate(claimId, fieldsData, 'type');
        this.setState({
            fieldsData: { optionalData: [], requiredData: [] }
        });
    };

    typeChangeHandler = (e, { value }) => {
        const { claimId, claimTypeUpdate, claimInfo } = this.props;
        if (!claimInfo.type) {
            claimTypeUpdate(claimId, { type: value }, 'type');
        }
    };

    cleanupField = (fieldType, fieldName) => {
        const { fieldsData } = this.state;
        const newState = fieldsData[fieldType].filter(
            item => item.name !== fieldName
        );
        this.setState({
            fieldsData: {
                ...fieldsData,
                [fieldType]: newState
            }
        });
    };

    getFieldsList = fieldType => {
        const fields = this.state.type[fieldType];
        return fields.map((field, id) => (
            <List.Item key={id}>
                <ClaimInfoField
                    field={field}
                    inputHandler={this.inputHandler.bind(
                        this,
                        fieldType,
                        field.name
                    )}
                    cleanupField={this.cleanupField.bind(
                        this,
                        fieldType,
                        field.name
                    )}
                />
            </List.Item>
        ));
    };

    componentWillMount() {
        const { types, claimInfo } = this.props;
        const activeType = claimInfo.type
            ? getActiveType(types, claimInfo)
            : null;
        this.setState({ type: activeType });
    }

    componentWillReceiveProps({ types, claimInfo }) {
        if (claimInfo.type) {
            const activeType = claimInfo.type
                ? getActiveType(types, claimInfo)
                : null;
            this.setState({ type: activeType });
        }
    }

    render() {
        const { types, claimInfo: { type } } = this.props;
        const { fieldsData } = this.state;
        const isDisabled =
            !fieldsData.requiredData.length && !fieldsData.optionalData.length;
        const updatedTypes = updateTypesList(types.slice());
        return (
            <React.Fragment>
                <Form>
                    <FormSelect
                        onChange={this.typeChangeHandler}
                        options={updatedTypes}
                        placeholder="Type"
                        label="Type"
                        selection
                        value={type}
                        disabled={!!type}
                    />
                </Form>

                {type && (
                    <React.Fragment>
                        <h3>Required fields:</h3>
                        {this.getFieldsList('requiredData')}
                        <h3>Additional fields:</h3>
                        {this.getFieldsList('optionalData')}
                        <Button
                            primary
                            onClick={this.submitTypeChanges}
                            disabled={isDisabled}
                        >
                            Save
                        </Button>
                    </React.Fragment>
                )}
            </React.Fragment>
        );
    }
}

ClaimTypeFields.propTypes = {
    types: PropTypes.array.isRequired,
    claimId: PropTypes.string.isRequired,
    claimInfo: PropTypes.object.isRequired,
    claimTypeUpdate: PropTypes.func.isRequired,
    claimDetailsUpdate: PropTypes.func.isRequired
};
