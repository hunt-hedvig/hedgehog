import * as React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginProcess } from 'store/actions/loginActions';
import LoginProcess from "../../components/login/login-process/LoginProcess";

const LoginProcessPage = ({ loginProcess }) => (
    <LoginProcess loginProcess={loginProcess} />
);

LoginProcessPage.propTypes = {
    loginProcess: PropTypes.func.isRequired
};

export default connect(null, {
    loginProcess
})(LoginProcessPage);

