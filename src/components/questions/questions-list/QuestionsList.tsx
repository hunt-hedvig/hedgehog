import * as React from 'react';
import * as PropTypes from 'prop-types';
import styled from 'styled-components';
import SortedList from './SortedList';
import { Tab } from 'semantic-ui-react';

const ListContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 700px;
    margin: 0 auto 50px;
`;

const QuestionsList = ({
    questions,
    members,
    sendAnswer,
    tabChange,
    sendDoneMsg
}) => {
    const notAnswered = () => (
        <Tab.Pane>
            <SortedList
                list={questions.notAnswered}
                members={members}
                sendAnswer={sendAnswer}
                sendDoneMsg={sendDoneMsg}
            />
        </Tab.Pane>
    );

    const answered = () => (
        <Tab.Pane>
            <SortedList
                list={questions.answered}
                members={members}
                sendAnswer={sendAnswer}
                sendDoneMsg={sendDoneMsg}
            />
        </Tab.Pane>
    );

    const panes = [
        { menuItem: 'Not Answered', render: notAnswered },
        { menuItem: 'Answered', render: answered }
    ];

    return (
        <ListContainer>
            <Tab
                renderActiveOnly={true}
                panes={panes}
                onTabChange={tabChange}
            />
        </ListContainer>
    );
};

QuestionsList.propTypes = {
    questions: PropTypes.object.isRequired,
    sendAnswer: PropTypes.func.isRequired,
    sendDoneMsg: PropTypes.func.isRequired,
    tabChange: PropTypes.func.isRequired,
    members: PropTypes.array
};

export default QuestionsList;
