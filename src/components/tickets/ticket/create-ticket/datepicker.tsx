import React from 'react'
import {Input, Label } from 'semantic-ui-react'

class Datepicker extends React.Component {

	render(){
		return (
			<React.Fragment>
				<Label htmlFor={this.props.datepickerName}>
					Set remind notification date:
				</Label>
				<br/>
				<input 
					type="date" 
					name={this.props.datepickerName} 
					value={this.props.datepickerValue}
					onChange={(e) => this.props.handleChange(e)}
				/>	
				<br/>
				<Label htmlFor={this.props.timepickerName}>
					Set remind notification time:
				</Label>
				<br/>
				<Input 
					type="text" 
					maxLength={8}
					placeholder="hh:mm:zz"
					onChange={(e) => this.props.handleChange(e)}
					value={this.props.timepickerValue}
					name={this.props.timepickerName} 
					pattern="[0-9]{2}:[0-9]{2}:[0-9]{2}"/> 
			</React.Fragment>
		) 
	}
}

export default Datepicker