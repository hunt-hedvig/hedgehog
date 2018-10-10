import {
    CREATE_NOTE_REQUESTING,
    CREATE_NOTE_SUCCESS
} from '../constants/claims';

export const createNote = (id, data) => ({
    type: CREATE_NOTE_REQUESTING,
    id,
    data
});

export const createNoteSuccess = note => ({
    type: CREATE_NOTE_SUCCESS,
    note
});
