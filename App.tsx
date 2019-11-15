import * as React from 'react';
import {HomeScreen} from './Screens/HomeScreen';
import {SessionScreen} from './Screens/SessionScreen';
import {SessionCreateScreen} from './Screens/SessionCreateScreen';
import { Image } from 'react-native-elements';
import { Container, Header, Title,Label, Content,Input,Form,Item, View, FooterTab, Button, Left, Right, Body, Icon, Text } from 'native-base';

interface HeaderProps{
  title:String;
  includeClose: boolean;
}
class LogoHeader extends React.PureComponent<HeaderProps> {
  render() {
    const { title } = this.props;
    return (
      <Header>
        <Body>
        <Title>Spotifete - {title}</Title>
        </Body>
        <Right>
          <Image
          source={require('./SpotiFeteLogo.png')}
          style={{ width: 50, height: 50 }}
          />
        </Right>
      </Header>
      
    );
  }
}


interface Props {}

interface State {
  joinVisible: boolean;
  sessionId: string;
}

export default class App extends React.Component<Props, State> {
  constructor (props:Props) {
    super(props);

    this.state = {
      joinVisible: false,
      sessionId: ""
    }
  }

  render() {
    //return <AppContainer />;

    const {joinVisible,sessionId} = this.state;

    if (joinVisible) {
      return (<SessionScreen
      sessionId={sessionId}
                  onRequestClose={() => this.setState({joinVisible: false, sessionId:""})}/>
      )
    }
    else {
      return ( 
        <Container>
          <Header>
            <Body>
            <Title>Spotifete - Home</Title>
            </Body>
            <Right>
              <Image
              source={require('./SpotiFeteLogo.png')}
              style={{ width: 50, height: 50 }}
              />
            </Right>
          </Header>
          <Content padder>
            <Form style={{marginVertical:10}}>
            <Text>To Join a Session type in the Session ID</Text>
              <Item floatingLabel>
                <Label>Session ID</Label>
                <Input
                onChangeText={sessionId => this.setState({ sessionId })}
                />
              </Item>
            </Form>
              <Button block={true} style={{marginVertical:10}} disabled={sessionId == ""}
              onPress={() => this.setState({joinVisible: true})}>
                <Text>Join Session</Text>
              </Button>
            <Button block={true} style={{marginVertical:10}}>
              <Text>Start Session</Text>
            </Button>
            {/* <Button block={true} onPress={() => this.setState({joinVisible: true})}>
              <Text>Beitreten</Text>
            </Button> */}
          </Content>
        </Container>)
    }
  }
}