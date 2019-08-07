import React from 'react'
import { Query } from 'react-apollo'
import { TICKET_HISTORY } from '../../features/taskmanager/queries'


class TicketHistory extends React.Component {

	public render() {
		return(

				<Query<any> query={TICKET_HISTORY} variables={{id: this.props.id }} >
					{( {data, error, loading}) => {
						if (loading) {
							return (<p>Loading</p>)
						}
						if (error) {
							return (
								<p> Error! : {error.message} {error.networkError})</p>)
						}

						//We got the data:

						return (
								<TicketContainer>
								<TicketHead />
								<List thing>
								{
									data.revisions.map( revision => (
										return <TicketRevision ...props > 
										)  
									)
								}
								</List thing>
								<TicketContainer/>
							)
						}
					}
				</Query>
			)
		}

}