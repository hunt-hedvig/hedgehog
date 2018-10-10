import styled from 'styled-components';
import { Table, List } from 'semantic-ui-react';

export const ListPage = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    max-width: 600px;
    margin: 0 auto 50px;
`;

export const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
`;

export const ListContainer = styled.div`
    width: ${props => props.autoWidth || '500px'};
    border: solid 1px #dfe0e0;
    border-radius: 5px;
    padding: 20px 10px;
    margin-bottom: 50px;
`;

export const ItemContent = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const LinkRow = styled(Table.Row)`
    &&& {
        cursor: pointer;
    }
`;

export const ScrollList = styled(List)`
     &&& {
         max-height: 200px;
         overflow-y: scroll;
     }
`
