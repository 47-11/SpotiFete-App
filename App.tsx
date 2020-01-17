import * as React from 'react';
import { SessionScreen } from './#Screens/SessionScreen';
import { CreateScreen } from './#Screens/CreateScreen';
import { AccountOptions } from './#Components/AccountOptions';
import { Image } from 'react-native-elements';
import { Container, Header,StyleProvider , Title, Label, Content, Input, Form, Item, View, FooterTab, Button, Left, Right, Body, Icon, Text, Root, Toast, H3 } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import { checkLoginStatus, noServerConnection, fetchFromBaseWithBody, fetchFromBase } from './#Functions/FetchData';
import { ThemeExample } from './#Functions/Test';
import { Linking } from 'react-native';
import getTheme from './native-base-theme/components';
import commonColor from './native-base-theme/variables/commonColor';

interface Props { }

interface State {
  sessionVisible: boolean;
  sessionVisibleAdmin: boolean;
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
      sessionVisibleAdmin: false,
      joinId: "",
      createVisible: false,
      loggedIn: false,
      sessionId: undefined
    }
  }
  async componentDidMount() {
    await this.checkUserLoginState();
    Linking.getInitialURL().then((url) => {
      if (url) {
        this.handleOpenURL(url);
      }
    }).catch(err => {
      console.warn('An error occurred', err);
    });
  }

  handleOpenURL(url) {
    console.log("Url: " + url);
    const route = url.replace(/.*?:\/\//g, '');
    console.log("Route:" + route);
    const sessionRoute = route.indexOf("session/");
    if (sessionRoute >= 0) {

      const joinId = route.replace("session/", "");
      console.log("joinId:" + joinId);
      this.checkJoinId(joinId);
    }
  }

  joinIdChange(newjoinId){
    newjoinId = newjoinId.replace( /\D/g, '');
    if (newjoinId.length > 4){
      newjoinId = newjoinId.substring(0,4) + " - " + newjoinId.substring(4);
    }
    this.setState({ joinId: newjoinId });
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
      } else {
        this.setState({ loggedIn: false });
      }
    } catch (error) {
      console.log("checkUserLoginState failed: " + error);
      noServerConnection();
      setTimeout(() => this.checkUserLoginState(), 10000);
    }
  }

  async checkJoinId(joinId) {
    try {
      const sessionResponse = await fetchFromBase(`/sessions/${joinId}`,[200]);
      if (sessionResponse.joinId == joinId) {
        this.setState({ sessionVisible: true, joinId: joinId });
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
    const { sessionVisible, joinId, createVisible, loggedIn,sessionVisibleAdmin } = this.state;
    if (sessionVisible) {
      return (
        <StyleProvider style={getTheme(commonColor)}>
        <Root>
          <SessionScreen
            joinId={joinId}
            onRequestClose={() => { this.setState({ sessionVisible: false, joinId: "" }); this.checkUserLoginState(); }}
            adminMode={false} />
        </Root>
        </StyleProvider>
      )
    }else if(sessionVisibleAdmin){
      return (
        <StyleProvider style={getTheme(commonColor)}>
          <Root>
          <SessionScreen
            joinId={joinId}
            onRequestClose={() => { this.setState({ sessionVisibleAdmin: false, joinId: "" }); this.checkUserLoginState(); }}
            adminMode={true} />
        </Root>
        </StyleProvider>)
    } else if (createVisible) {
      return (
        <StyleProvider style={getTheme(commonColor)}>
        <Root><CreateScreen
          onRequestClose={() => { this.setState({ createVisible: false }); this.checkUserLoginState(); }}
          joinId={undefined}
        />
        </Root>
        </StyleProvider>
      )
    }
    else {
      return (
        <StyleProvider style={getTheme(commonColor)}>
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
                      onChangeText={joinId => {this.joinIdChange(joinId)}}
                      keyboardType={"number-pad"}
                      onSubmitEditing={() => { this.checkJoinId(joinId.replace( /\D/g, ''))}}
                      returnKeyType={"send"}
                      value={this.state.joinId}
                      maxLength={11}
                    />

                  </Item>
                  <Button block={true} style={{ marginVertical: 10 }} disabled={joinId == ""}
                    onPress={() => { this.checkJoinId(joinId.replace( /\D/g, ''))}}
                  >
                    <Text>Join Session</Text>
                  </Button>
                  <Button block={true} style={{ marginVertical: 10 }}
                    onPress={() => this.setState({ createVisible: true })}>
                    <Text>Start Session / Login</Text>
                  </Button>
                </Form>

                {loggedIn ? <AccountOptions onOpenSession={(joinId) => {this.setState({joinId:joinId, sessionVisibleAdmin: true})}} sessionId={this.state.sessionId} onLogout={() => this.checkUserLoginState()}></AccountOptions> : <Text>You are currently not logged in. To see all your Sessions here please do so.</Text>}
              </View>
            </Content>
          </Container>
        </Root>
        </StyleProvider>
        )
    }
  }
}