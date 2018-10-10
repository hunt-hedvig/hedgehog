import * as React from 'react';
import * as PropTypes from 'prop-types';
import { List } from 'semantic-ui-react';
import { ScrollList } from 'components/shared';

const NotesList = ({ notes }) => (
    <ScrollList selection>
        {notes &&
            notes.map((note, id) => (
                <List.Item key={note.id || id}>
                    <List.Content>{note.text}</List.Content>
                    {note.file && (
                        <a href={note.file} target="_blank">
                            file
                        </a>
                    )}
                </List.Item>
            ))}
    </ScrollList>
);

NotesList.propTypes = {
    notes: PropTypes.array
};

export default NotesList;
