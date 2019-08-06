import React from 'react'
import actions from '../../../../store/actions/index'
import { Mutation } from 'react-apollo'
import { QUESTION_IS_DONE } from '../../../../features/taskmanager/queries'
import { connect } from 'react-redux'
import { Button } from 'semantic-ui-react'


//TODO: Inteface

class MessageResponseForm extends React.Component  {

	public render () {
		return (
			<Mutation mutation={QUESTION_IS_DONE}>
				{(questionIsDone, {data}) =>{ 
					return (
						<Button onClick={(event)=>{
							event.preventDefault()
							questionIsDone({variables: {
								memberId: this.props.memberId
							},
						}).then(() => {
                    this.props.showNotification({
                      header: 'Change success!',
                      message:'Set conversation as done!',
                      type: 'green',
                    })
                  })
                  .catch((error) => {
                    this.props.showNotification({
                      header: 'Error',
                      message: error.message,
                      type: 'red',
                    })
                    throw error
                  })
				}}>
					Done </Button>
				)
			}
		}
		</Mutation>
		)
	}
}

const mapActions = { ...actions.notificationActions }

export default connect (null, mapActions)(MessageResponseForm)