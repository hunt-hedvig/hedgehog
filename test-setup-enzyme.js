const { configure } = require('enzyme')
const Adapter = require('@wojtekmaj/enzyme-adapter-react-17')
require('jest')

configure({ adapter: new Adapter() })
