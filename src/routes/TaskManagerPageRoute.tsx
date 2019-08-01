import TaskManagerPage from '../features/taskmanager/index'
import * as React from 'react'
import actions from '../store/actions'
import { connect } from 'react-redux'

////////////////////////////////REMEMBER THIS BRO

const TaskManagerPageRoute = (props) => <TaskManagerPage {...props} />

const mapStateToProps = ({members})  => ({
	members,
})

export default connect(mapStateToProps)(TaskManagerPageRoute);
