import React from 'react';
import SiriusAdapter from '@edgarjeremy/sirius.adapter';
import AsyncStorage from '@react-native-community/async-storage';
import io from 'socket.io-client';
import Unauthenticated from './src/screens/Unauthenticated';
import NoConnection from './src/screens/NoConnection';
import Home from './src/screens/Home';
import Loading from './src/screens/Loading';

const adapter = new SiriusAdapter('http://10.0.2.2', 1234, AsyncStorage);

class App extends React.Component {

  state = {
    ready: false,
    error: false,
    models: null,
    user: null,
    socket: null
  }

  componentDidMount() {
    this.fetch();
  }

  fetch() {
    adapter.connect().then((models) => {
      const authProvider = adapter.getAuthProvider();
      authProvider.get().then((user) => {
        console.log('got connection, got user');
        const socket = io('http://10.0.2.2:1234');
        socket.on('connect', () => {
          this.setState({ ready: true, models, user, socket });
        });
      }).catch(() => {
        console.log('got connection, no user');
        this.setState({ ready: true, models });
      });
    }).catch(() => {
      console.log('no connection');
      this.setState({ ready: true, error: true });
    });
  }

  render() {
    const { ready, error, models, user, socket } = this.state;
    return (
      ready ? (
        error ? (
          <NoConnection />
        ) : (
            user ? (
              <Home user={user} socket={socket} models={models} />
            ) : (
                <Unauthenticated models={models} afterLogin={this.fetch.bind(this)} authProvider={adapter.getAuthProvider()} />
              )
          )
      ) : (
          <Loading />
        )
    )
  }

}

export default App;
