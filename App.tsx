import * as React from 'react';
import {SessionScreen} from './#Screens/SessionScreen';
import {CreateScreen} from './#Screens/CreateScreen';
import {NoServerConnection} from './#Functions/NoServerConnection';
import { Image } from 'react-native-elements';
import { Container, Header, Title,Label, Content,Input,Form,Item, View, FooterTab, Button, Left, Right, Body, Icon, Text, Root, Toast } from 'native-base';

interface Props {}

interface State {
  sessionVisible: boolean;
  createVisible: boolean;
  joinId: string;
}

export default class App extends React.Component<Props, State> {
  constructor (props:Props) {
    super(props);

    this.state = {
      sessionVisible: false,
      joinId: "",
      createVisible: false
    }
  }

  render() {
    //return <AppContainer />;

    const {sessionVisible,joinId,createVisible} = this.state;

    if (sessionVisible) {
      return (
        <Root><SessionScreen
        joinId={joinId}
                  onRequestClose={() => this.setState({sessionVisible: false, joinId:""})}/>
        </Root>
      )
    } else if (createVisible){
        return (
        <Root><CreateScreen
         onRequestClose={() => this.setState({createVisible: false})}/>
         </Root>
         )
    }
    else {
      return ( 
        <Root>
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
                onChangeText={joinId => this.setState({ joinId })}
                />
              </Item>
            </Form>
              <Button block={true} style={{marginVertical:10}} disabled={joinId == ""}
              onPress={() => this.setState({sessionVisible: true})}
                >
                <Text>Join Session</Text>
              </Button>
            <Button block={true} style={{marginVertical:10}}
            onPress={() => this.setState({createVisible: true})}>
              <Text>Start Session</Text>
            </Button>
          </Content>
        </Container>
        </Root> )
    }
  }
}