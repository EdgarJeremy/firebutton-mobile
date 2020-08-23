import React from 'react';
import SiriusAdapter from '@edgarjeremy/sirius.adapter';
import AsyncStorage from '@react-native-community/async-storage';
import io from 'socket.io-client';
import Unauthenticated from './src/screens/Unauthenticated';
import NoConnection from './src/screens/NoConnection';
import Home from './src/screens/Home';
import Loading from './src/screens/Loading';

const host = 'http://firebutton.harusnyasihbisa.com';
const port = 80;

const adapter = new SiriusAdapter(host, port, AsyncStorage);

class App extends React.Component {

  state = {
    ready: false,
    error: false,
    models: null,
    user: null,
    socket: null,
    authProvider: null
  }

  componentDidMount() {
    this.fetch();
  }

  fetch() {
    adapter.connect().then((models) => {
      const authProvider = adapter.getAuthProvider();
      const socket = io(`${host}:${port}`);
      socket.on('connect', () => {
        this.setState({ authProvider, ready: true, models, socket });
      });
      // authProvider.get().then((user) => {
      //   console.log('got connection, got user');
      //   const socket = io(`${host}:${port}`);
      //   socket.on('connect', () => {
      //     this.setState({ ready: true, models, user, socket });
      //   });
      // }).catch(() => {
      //   console.log('got connection, no user');
      //   this.setState({ ready: true, models });
      // });
    }).catch((err) => {
      console.log('no connection');
      this.setState({ ready: true, error: err });
    });
  }

  afterLogin() {
    const { authProvider } = this.state;
    authProvider.get().then((user) => {
      console.log('got connection, got user');
      const socket = io(`${host}:${port}`);
      socket.on('connect', () => {
        this.setState({ ready: true, user });
      });
    }).catch(() => {
      console.log('got connection, no user');
      this.setState({ ready: true });
    });
  }

  render() {
    const { ready, error, models, user, socket } = this.state;
    return (
      ready ? (
        error ? (
          <NoConnection error={error} />
        ) : (
            user ? (
              <Home user={user} socket={socket} models={models} />
            ) : (
                <Unauthenticated models={models} afterLogin={this.afterLogin.bind(this)} authProvider={adapter.getAuthProvider()} />
              )
          )
      ) : (
          <Loading />
        )
    )
  }

}

export default App;
