/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    TextInput,
    TouchableNativeFeedback,
    Button
} from 'react-native';

import {
    Header,
    LearnMoreLinks,
    Colors,
    DebugInstructions,
    ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const styles = StyleSheet.create({
    appTitle: {
        fontSize: 50,
        textAlign: 'center',
        marginTop: 50,
        marginBottom: 50,
        fontWeight: 'bold',
        color: '#a4564e'
    },
    inputText: {
        fontSize: 20,
        marginTop: 20,
        marginLeft: 10,
        marginRight: 10,
        borderBottomWidth: 1,
        // borderBottomColor: '#ffffff',
        // color: '#ffffff'
    },
    btn: {
        marginTop: 30,
        margin: 10
    },
    frame: {
        paddingLeft: 20,
        paddingRight: 20,
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#ffffff'
    }
});

class Unauthenticated extends React.Component {

    state = {
        screen: 'login',
        loading: false,
        loginData: {
            username: '',
            password: ''
        },
        daftarData: {
            nik: '',
            username: '',
            password: '',
            retype_password: '',
            phone: ''
        }
    }

    changeScreen(screen) {
        this.setState({ screen });
    }

    onChangeField(data, field, value) {
        this.setState({
            [data]: {
                ...this.state[data],
                [field]: value
            }
        }, () => console.log(this.state));
    }

    onLogin() {
        const { authProvider, afterLogin } = this.props;
        const data = this.state.loginData;
        this.setState({ loading: true });
        authProvider.set(data).then((user) => afterLogin()).catch((err) => {
            alert('Login error');
            this.setState({ loading: false });
        });
    }

    onDaftar() {
        const { models } = this.props;
        const data = this.state.daftarData;
        if (data.password === data.retype_password) {
            this.setState({ loading: true });
            delete data.retype_password;
            models.User.create(data).then((user) => {
                alert(`Selamat datang ${user.username}. Silakan login untuk melanjutkan`);
                this.setState({
                    screen: 'login',
                    daftarData: { nik: '', username: '', password: '', retype_password: '' },
                    loading: false
                });
            }).catch((err) => {
                let msg = '';
                for (let i = 0; i < err.errors.length; i++) {
                    const error = err.errors[i];
                    msg += error.msg + '\n';
                }
                alert(msg);
                this.setState({ loading: false });
            });
        } else {
            alert('Password tidak cocok!');
        }
        this.setState({ loading: false });
    }

    render() {
        const { screen, loading } = this.state;
        return (
            <View style={styles.frame}>
                <Text style={styles.appTitle}>FireButton</Text>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableNativeFeedback style={{ flex: 1, padding: 10 }} background={TouchableNativeFeedback.Ripple('#a4564e')} onPress={() => this.changeScreen('login')}>
                        <View style={{ flex: 1, padding: 20, backgroundColor: screen === 'login' ? '#efefef' : '#ffffff' }}>
                            <Text style={{ fontSize: 20, textAlign: 'center', color: '#000000' }}>Login</Text>
                        </View>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback style={{ flex: 1, padding: 10 }} background={TouchableNativeFeedback.Ripple('#a4564e')} onPress={() => this.changeScreen('daftar')}>
                        <View style={{ flex: 1, padding: 20, backgroundColor: screen === 'daftar' ? '#efefef' : '#ffffff' }}>
                            <Text style={{ fontSize: 20, textAlign: 'center', color: '#000000' }}>Daftar</Text>
                        </View>
                    </TouchableNativeFeedback>
                </View>
                {screen === 'login' ? (
                    <View style={{ backgroundColor: '#efefef', padding: 20 }}>
                        <TextInput style={styles.inputText} onChangeText={(username) => this.onChangeField('loginData', 'username', username)} placeholder="Username" />
                        <TextInput style={styles.inputText} placeholder="Password" onChangeText={(password) => this.onChangeField('loginData', 'password', password)} secureTextEntry={true} />
                        <View style={styles.btn}>
                            <Button color="#a4564e" title={loading ? 'loading' : 'login'} onPress={this.onLogin.bind(this)} disabled={loading} />
                        </View>
                    </View>
                ) : (
                        <View style={{ backgroundColor: '#efefef', padding: 20 }}>
                            <TextInput style={styles.inputText} placeholder="NIK" onChangeText={(nik) => this.onChangeField('daftarData', 'nik', nik)} />
                            <TextInput style={styles.inputText} placeholder="Username" onChangeText={(username) => this.onChangeField('daftarData', 'username', username)} />
                            <TextInput style={styles.inputText} placeholder="Nomor HP" onChangeText={(phone) => this.onChangeField('daftarData', 'phone', phone)} keyboardType="phone-pad" />
                            <TextInput style={styles.inputText} placeholder="Password" onChangeText={(password) => this.onChangeField('daftarData', 'password', password)} secureTextEntry={true} />
                            <TextInput style={styles.inputText} placeholder="Ketik Ulang Password" onChangeText={(retype_password) => this.onChangeField('daftarData', 'retype_password', retype_password)} secureTextEntry={true} />
                            <View style={styles.btn}>
                                <Button color="#a4564e" title={loading ? 'loading...' : 'daftar'} onPress={this.onDaftar.bind(this)} disabled={loading} />
                            </View>
                        </View>
                    )}
            </View>
        )
    }

}

export default Unauthenticated;
