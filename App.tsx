import * as React from 'react';
import {SessionScreen} from './Screens/SessionScreen';
import {CreateScreen} from './Screens/CreateScreen';
import { Image } from 'react-native-elements';
import { Container, Header, Title,Label, Content,Input,Form,Item, View, FooterTab, Button, Left, Right, Body, Icon, Text } from 'native-base';

interface Props {}

interface State {
  sessionVisible: boolean;
  loginRequired: boolean;
  sessionId: string;
}

export default class App extends React.Component<Props, State> {
  constructor (props:Props) {
    super(props);

    this.state = {
      sessionVisible: false,
      sessionId: "",
      loginRequired: false
    }
  }

  render() {
    //return <AppContainer />;

    const {sessionVisible,sessionId,loginRequired} = this.state;

    if (sessionVisible) {
      return (<SessionScreen
      sessionId={sessionId}
                  onRequestClose={() => this.setState({sessionVisible: false, sessionId:""})}/>
      )
    } else if (loginRequired){
      return (<CreateScreen
         onRequestClose={() => this.setState({loginRequired: false})}/>
        )
    }
    else {
      return ( 
        <Container>
          <Header>
            <Body>
            <Title>Home</Title>
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
              onPress={() => this.setState({sessionVisible: true})}>
                <Text>Join Session</Text>
              </Button>
            <Button block={true} style={{marginVertical:10}}
            onPress={() => this.setState({loginRequired: true})}>
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