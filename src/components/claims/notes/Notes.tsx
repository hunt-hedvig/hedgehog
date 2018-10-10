import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Segment } from 'semantic-ui-react';
import NewNote from './NewNote';
import NotesList from './NotesList';

const Notes = ({ createNote, notes, id }) => (
    <Segment>
        <NewNote createNote={createNote} id={id} />
        <NotesList notes={notes} />
    </Segment>
);

Notes.propTypes = {
    createNote: PropTypes.func.isRequired,
    notes: PropTypes.array.isRequired,
    id: PropTypes.string.isRequired
};

export default Notes;
