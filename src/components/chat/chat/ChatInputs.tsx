import * as React from 'react';
import DateInput from 'components/shared/inputs/DateInput';
import TextFileInput from 'components/shared/inputs/TextFileInput';
import NumberInput from 'components/shared/inputs/NumberInput';
import SelectCreator from 'components/shared/inputs/SelectCreator';
import TextInput from 'components/shared/inputs/TextInput';
import * as types from 'lib/messageTypes';

/**
 * returns input by message typename from boot service
 */
export default {
    [types.TEXT](onChangeHandler, cleanupForm) {
        return (
            <TextInput
                changeHandler={onChangeHandler}
                cleanupForm={cleanupForm}
                label
            />
        );
    },

    [types.PARAGRAPH](onChangeHandler, cleanupForm) {
        return (
            <TextInput
                changeHandler={onChangeHandler}
                cleanupForm={cleanupForm}
                label
            />
        );
    },

    [types.NUMBER](onChangeHandler) {
        return <NumberInput changeHandler={onChangeHandler} />;
    },

    [types.DATE](onChangeHandler, cleanupForm) {
        return (
            <React.Fragment>
                <TextInput
                    changeHandler={onChangeHandler}
                    cleanupForm={cleanupForm}
                    label
                />
                <DateInput
                    changeHandler={onChangeHandler}
                    cleanupForm={cleanupForm}
                    label
                />
            </React.Fragment>
        );
    },

    select(onChangeHandler, type, cleanupForm) {
        return (
            <SelectCreator
                changeHandler={onChangeHandler}
                selectType={type}
                cleanupForm={cleanupForm}
            />
        );
    },

    file(onChangeHandler, type, cleanupForm) {
        return (
            <TextFileInput
                changeHandler={onChangeHandler}
                type={type}
                cleanupForm={cleanupForm}
            />
        );
    }
};
