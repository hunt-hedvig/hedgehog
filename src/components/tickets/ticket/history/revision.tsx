import React from 'react'
import { Label, Segment, Grid, Button  } from 'semantic-ui-react'
import { TicketChangeType } from   '../../../../features/taskmanager/types'


export class TicketRevision extends React.Component<{},{}> {
	public state = {
        showDetails: false, 
    }

    private toggleShowDetails = (event) => {
      event.preventDefault()
      const newState = !this.state.showDetails
      this.setState( {showDetails: newState })
    }

    private renderTicketDetails = (changeType) => {
        switch (changeType) {
           case TicketChangeType.TICKET_CREATED:
                return ( 
                    <Grid columns={2} celled>
                    <Grid.Row>
                        <Grid.Column>Original ticket</Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={4}><em>Description</em></Grid.Column>
                        <Grid.Column>{this.props.description}</Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={4}><em>Assigned to:</em></Grid.Column>
                        <Grid.Column>{this.props.assignedTo}</Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={4}><em>Manual priority:</em></Grid.Column>
                        <Grid.Column>{this.props.manualPriority}</Grid.Column>
                    </Grid.Row>
                    </Grid>
                    )
           break;
            
           case TicketChangeType.CHANGED_REMINDER: 
                return ( 
                    <Grid columns={2} celled>
                    <Grid.Row>
                        <Grid.Column width={4}><em>Reminder date</em></Grid.Column>
                        <Grid.Column>{this.props.remindDate}</Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={4}><em>Remind time: </em></Grid.Column>
                        <Grid.Column>{this.props.remindTime}</Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={4}><em>Remind message: </em></Grid.Column>
                        <Grid.Column>{this.props.manualPriority}</Grid.Column>
                    </Grid.Row>
                    </Grid>)
           break;

           case TicketChangeType.CHANGED_ASSIGNED_TO:
                return(<Segment>Changed assigned to  details </Segment>)


           case  TicketChangeType.CHANGED_DESCRIPTION:
                return (<Segment>Description changed details </Segment>)
            break
          
           case TicketChangeType.CHANGED_STATUS: 
                return (<Segment>Change status  details </Segment>)
           break
          
           case TicketChangeType.CHANGED_PRIORITY: 
                return (<Segment>Change priority details </Segment>)
           break

           default:
                return (<Segment>Something went wrong... details </Segment>)
            break;
        }
    }

    public render() {
    return (
		<Segment.Group raised vertical>
			<Label ribbon color='blue'>Revision</Label>
            <Button 
                compact 
                size="tiny" 
                color="vk" 
                onClick={this.toggleShowDetails}
                floated="right">
                {this.state.showDetails ? 'Hide details' : 'Show details' }
            </Button>
			<Segment.Group horizontal>
				<Segment><Label attached='top'>A revision of type:</Label> <p>{this.props.changeType}</p> </Segment>
				<Segment><Label attached='top'>Changed by:</Label> <p>{this.props.changedBy}</p> </Segment>
				<Segment><Label attached='top'>Changed at:</Label> <p>{this.props.changedAt}</p></Segment>
			</Segment.Group >
            <Segment>
                {  
                 this.state.showDetails ? 
                 this.renderTicketDetails(this.props.changeType) :
                 null 
                 }
            </Segment>

    	</Segment.Group>
        ) 
    }
}

