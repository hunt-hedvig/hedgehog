import * as React from 'react';
import * as PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button, Form, TextArea, Message } from 'semantic-ui-react';

const FormGroup = styled(Form.Group)`
    &&& {
        display: flex;
        align-items: flex-end;
        width: 100%;
        margin-top: 10px;
    }
`;

const FormTextArea = styled(Form.Field)`
    &&& {
        width: 100%;
    }
`;

export default class AnswerForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            answer: ''
        };
    }

    answerChangeHandler = (e, { value }) => {
        this.setState({ answer: value });
    };

    answerClick = id => {
        if (this.state.answer.trim().length) {
            this.props.sendAnswer({ msg: this.state.answer, id });
        }
    };

    doneClick = id => {
        this.props.sendDoneMsg({ id });
    };

    render() {
        const { memberId, redirectClick, error } = this.props;
        return (
            <React.Fragment>
                <Form>
                    <FormGroup>
                        <FormTextArea
                            control={TextArea}
                            label="Answer"
                            placeholder="Answer text..."
                            onChange={this.answerChangeHandler}
                            value={this.state.answer}
                        />
                        <div>
                            <Button
                                style={{ marginBottom: '3px' }}
                                content="Open Chat"
                                onClick={redirectClick.bind(this, memberId)}
                            />
                            <Button
                                content="Send"
                                onClick={this.answerClick.bind(this, memberId)}
                                primary
                                disabled={!this.state.answer.trim().length}
                            />
                            <Button
                                content="Done"
                                onClick={this.doneClick.bind(this, memberId)}
                                primary
                            />
                        </div>
                    </FormGroup>
                </Form>
                {error ? <Message negative>{error}</Message> : null}
            </React.Fragment>
        );
    }
}

AnswerForm.propTypes = {
    memberId: PropTypes.string.isRequired,
    sendAnswer: PropTypes.func.isRequired,
    sendDoneMsg: PropTypes.func.isRequired,
    redirectClick: PropTypes.func.isRequired,
    error: PropTypes.string
};
