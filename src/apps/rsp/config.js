import RspApp from "./containers/RspApp";
import epic from './epics'
import reducer from './reducers'

export default createApp('rsp', RspApp, epic, reducer);
