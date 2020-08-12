import React from 'react';
import { View, Text, TouchableNativeFeedback, TouchableOpacity, Image, StyleSheet } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Geolocation from '@react-native-community/geolocation';

const styles = StyleSheet.create({
    appTitle: {
        fontSize: 30,
        textAlign: 'center',
        marginTop: 50,
        marginBottom: 50,
        fontWeight: 'bold',
        color: '#eeeeee'
    },
    info: {
        color: '#eeeeee'
    },
    panicButton: {
        backgroundColor: '#eeeeee',
        width: 300,
        height: 300,
        elevation: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 200
    }
});

export default class Home extends React.Component {

    state = {
        position: null,
        hasPanic: false
    }

    componentDidMount() {
        const { socket } = this.props;
        Geolocation.getCurrentPosition((position) => this.setState({ position }));
        Geolocation.watchPosition((position) => this.setState({ position }));
        socket.off('respond');
        socket.on('respond', () => {
            this.setState({ hasPanic: false });
            alert('Petugas pemadam kebakaran segera datang!');
        });
    }

    onPanic() {
        const { socket, user } = this.props;
        const { position } = this.state;
        ImagePicker.launchCamera({
            title: 'Foto Kejadian',
            storageOptions: {
                skipBackup: true
            }
        }, (response) => {
            this.setState({ hasPanic: true });
            socket.emit('panic', {
                user, position,
                photo: response.data
            });
        });
    }

    render() {
        const { position, hasPanic } = this.state;
        return (
            <View style={{ alignItems: 'center', alignContent: 'center', backgroundColor: '#17191c', flex: 1, justifyContent: 'center' }}>
                {position && <Text style={styles.info}>Koordinat anda : {position.coords.latitude},{position.coords.longitude}</Text>}
                <Text style={styles.appTitle}>Tekan tombol dibawah hanya dalam keadaan darurat</Text>
                <TouchableOpacity disabled={!position || hasPanic} style={[styles.panicButton, { backgroundColor: hasPanic ? 'grey' : styles.panicButton.backgroundColor }]} onPress={this.onPanic.bind(this)}>
                    <Text style={{
                        fontSize: 50,
                        color: '#a4564e',
                        fontWeight: 'bold'
                    }}>PANIK!!</Text>
                </TouchableOpacity>
            </View>
        )
    }

}