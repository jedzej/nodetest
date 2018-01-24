//import './styles/normalize.css';
//import './styles/skeleton.css';
import './styles/app.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import { ConnectedRouter } from 'react-router-redux';
import { Switch, Route } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';

import createStore from "./store";
import registerServiceWorker from './registerServiceWorker';
import ObserveRoute from './routes/ObserveRoute';
import IndexRoute from './routes/IndexRoute';
import NotificationsProvider from './containers/NotificationsProvider';
import ConnectingModal from './components/ConnectingModal';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import teal from 'material-ui/colors/teal';
import amber from 'material-ui/colors/amber';
import orange from 'material-ui/colors/orange';
import createMuiTheme from 'material-ui/styles/createMuiTheme';
import createPalette from 'material-ui/styles/createPalette';

const theme = createMuiTheme({
  palette: createPalette({
    primary: teal,
    secondary: amber,
    accent: orange
  })
});

const history = createHistory();
const store = createStore(history);

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <NotificationsProvider>
        <ConnectedRouter history={history}>
          <Switch>
            <Route exact path="/" component={IndexRoute} />
            <Route exact path="/observe" component={ObserveRoute} />
            <Route path="/observe/:token" component={ObserveRoute} />
            <Route path="*" component={() => <div>LOL NIE</div>} />
          </Switch>
        </ConnectedRouter>
        <ConnectingModal />
      </NotificationsProvider>
    </MuiThemeProvider>
  </Provider>
  , document.getElementById('root'));
registerServiceWorker();
