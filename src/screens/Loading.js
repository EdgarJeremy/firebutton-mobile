import React from 'react';
import { View, Text, Image, Dimensions } from 'react-native';

export default class Loading extends React.Component {

    render() {
        return (
            <View>
                <Image style={{ width: Dimensions.get('screen').width, height: Dimensions.get('screen').height }} source={{ uri: 'http://img0.joyreactor.com/pics/post/fire-loading-gif-1835748.gif' }} />
            </View>
        )
    }

}