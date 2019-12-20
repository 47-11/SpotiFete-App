import * as React from 'react';
import { SessionScreen } from './#Screens/SessionScreen';
import { CreateScreen } from './#Screens/CreateScreen';
import { AccountOptions } from './#Components/AccountOptions';
import { Image } from 'react-native-elements';
import { Container, Header, Title, Label, Content, Input, Form, Item, View, FooterTab, Button, Left, Right, Body, Icon, Text, Root, Toast, H3 } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import { checkLoginStatus, noServerConnection, fetchFromBaseWithBody, fetchFromBase } from './#Functions/FetchData';

interface Props { }

interface State {
  sessionVisible: boolean;
  createVisible: boolean;
  joinId: string;
  loggedIn: boolean;
  sessionId: string | undefined;
}

export default class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      sessionVisible: false,
      joinId: "",
      createVisible: false,
      loggedIn: false,
      sessionId: undefined
    }
  }
  async componentDidMount() {
    await this.checkUserLoginState();
  }

  async checkUserLoginState() {
    try {
      const sessionIdStored = await AsyncStorage.getItem('sessionId');
      console.log("stored value: " + sessionIdStored);
      if (sessionIdStored !== null) {
        const authenticated = await checkLoginStatus(sessionIdStored, 0, 0);
        if (authenticated) {
          this.setState({ loggedIn: true, sessionId: sessionIdStored });
        } else {
          this.setState({ loggedIn: false });
        }
      }
    } catch (error) {
      console.log("checkUserLoginState failed: " + error);
      noServerConnection();
      setTimeout(() => this.checkUserLoginState(), 10000);
    }
  }

  async checkJoinId(joinId){
    try {
      const sessionResponse = await fetchFromBase(`/sessions/${joinId}`);
      if(sessionResponse.active){
        this.setState({sessionVisible: true});
        return true;
      }
    } catch (error) {
      console.log(error);
    }
    console.log("joinId not active");
    Toast.show({
      text: 'No valid Session Id',
      buttonText: 'Okay',
      duration: 2000
    })
    return false;
  }
  render() {
    //return <AppContainer />;

    const { sessionVisible, joinId, createVisible, loggedIn } = this.state;

    if (sessionVisible) {
      return (
        <Root>
          <SessionScreen
            joinId={joinId}
            onRequestClose={() => { this.setState({ sessionVisible: false, joinId: "" }); this.checkUserLoginState(); }}
            adminMode={false} />
        </Root>
      )
    } else if (createVisible) {
      return (
        <Root><CreateScreen
          onRequestClose={() => { this.setState({ createVisible: false }); this.checkUserLoginState(); }}
          joinId={undefined}
        />
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
            <Content>
              <View padder>
                <Form style={{ marginVertical: 10 }}>
                  <H3 style={{ textAlign: "center" }}>To Join a Session type in the Session ID</H3>
                  <Item floatingLabel>
                    <Label>Session ID</Label>
                    <Input
                      onChangeText={joinId => this.setState({ joinId })}
                    />
                  </Item>
                  <Button block={true} style={{ marginVertical: 10 }} disabled={joinId == ""}
                    onPress={() => {this.checkJoinId(joinId)}}
                  >
                    <Text>Join Session</Text>
                  </Button>
                  <Button block={true} style={{ marginVertical: 10 }}
                    onPress={() => this.setState({ createVisible: true })}>
                    <Text>Start Session</Text>
                  </Button>
                </Form>

                {loggedIn ? <AccountOptions sessionId={this.state.sessionId} onLogout={() => this.checkUserLoginState()}></AccountOptions> : <Text>You are currently not logged in.</Text>}
              </View>
            </Content>
          </Container>
        </Root>)
    }
  }
}