import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Form, Input } from 'semantic-ui-react';
import { TEXT, NUMBER } from 'lib/messageTypes';

const NumberInput = ({ changeHandler }) => (
    <React.Fragment>
        <Form.Field>
            <label>Text</label>
            <Input fluid onChange={changeHandler.bind(this, TEXT)} />
        </Form.Field>
        <Form.Field>
            <label>Nubmer</label>
            <Input
                fluid
                type="number"
                onChange={changeHandler.bind(this, NUMBER)}
            />
        </Form.Field>
    </React.Fragment>
);

export default NumberInput;

NumberInput.propTypes = {
    changeHandler: PropTypes.func.isRequired
};
