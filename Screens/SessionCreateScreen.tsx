import * as React from 'react';
import { TextInput, Button, View, Text } from 'react-native';

export class SessionCreateScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Create Session',
    };
  };
  render() {
    const { navigation } = this.props;
    return (
      <View>
        <Text>
          To create your own Session you have to login to your Spotify Account
          first.
        </Text>
      </View>
    );
  }
}