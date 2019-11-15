import * as React from 'react';
import { Image } from 'react-native-elements';
import { View,Container, Header, Title, Subtitle, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text } from 'native-base';
interface SessionScreenProps {
  sessionId: string;
  onRequestClose(): void;
}

export class SessionScreen extends React.PureComponent<SessionScreenProps> {


  render() {
    const { sessionId, onRequestClose } = this.props;
    return (
      <Container>
        <Header>
          <Left> 
            <Button transparent={true} onPress={() => onRequestClose()}>
              <Icon name='arrow-left' type='MaterialCommunityIcons'/>
            </Button>
          </Left>
            <Body>
            <Title>Spotifete - Session</Title>
            </Body>
            <Right>
              <Image
              source={require('../SpotiFeteLogo.png')}
              style={{ width: 50, height: 50 }}
              />
            </Right>
          </Header>
        <Content>
          <Text>
            Welcome to the Session {sessionId}
          </Text>
        </Content>
      </Container>
    );
  }
}