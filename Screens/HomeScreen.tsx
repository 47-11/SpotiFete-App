import * as React from 'react';
import { TextInput, Button, View, Text } from 'react-native';

export class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home',
  };
  constructor(props) {
    super(props);
    this.state = { sessionId: '' };
  }
  render() {
    const { sessionId } = this.state;
    const joinEnabled = sessionId.length > 4;
    return (
      <View>
        <Text>To Join a Session type in the Session ID</Text>
        <TextInput
          placeholder="Your Id"
          onChangeText={sessionId => this.setState({ sessionId })}
          value={this.state.sessionId}
        />
        <Button
          title="Join Session"
          onPress={() =>
            this.props.navigation.navigate('Session', {
              sessionId: this.state.sessionId,
            })
          }
          disabled={!joinEnabled}
        />
        <Button
          title="Start Session"
          onPress={() => this.props.navigation.navigate('SessionCreate')}
        />
      </View>
    );
  }
}