import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import FileInput from 'components/shared/inputs/FileInput';

export default class NewNote extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            file: null,
            cleanupForm: false
        };
    }

    textChangeHandler = (e, { value }) => {
        this.setState({ text: value });
    };

    fileChangeHandler = (type, e, { value }) => {
        this.setState({ file: JSON.stringify(value) });
    };

    createClickHandler = () => {
        const { createNote, id } = this.props;
        const { text, file } = this.state;
        createNote(id, { text, file });
        this.setState(
            {
                text: '',
                file: '',
                cleanupForm: true
            },
            () => {
                this.setState({
                    cleanupForm: false
                });
            }
        );
    };

    render() {
        const { cleanupForm, text } = this.state;
        return (
            <Form onSubmit={this.createClickHandler}>
                <Form.TextArea
                    onChange={this.textChangeHandler}
                    placeholder="Note text..."
                    value={text}
                />
                <FileInput
                    changeHandler={this.fileChangeHandler}
                    cleanupForm={cleanupForm}
                />
                <Form.Button primary content="Add" />
            </Form>
        );
    }
}

NewNote.propTypes = {
    createNote: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired
};
