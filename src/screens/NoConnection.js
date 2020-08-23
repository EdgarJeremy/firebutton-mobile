import React from 'react';
import { View, Text } from 'react-native';

export default class NoConnection extends React.Component {

    render() {
        return (
            <View>
                <Text>Tidak dapat terkoneksi ke server</Text>
                <Text>{JSON.stringify(this.props.error)}</Text>
            </View>
        )
    }

}