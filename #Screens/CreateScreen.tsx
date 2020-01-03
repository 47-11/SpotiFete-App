import * as React from 'react';
import { View, Container, Item, Label, Input, Toast, Header, Title, Form, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, Root, Spinner, H1, Picker, H3 } from 'native-base';
import { Image } from 'react-native-elements';
import { Linking } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { fetchFromBase, checkLoginStatus, noServerConnection, fetchFromBaseWithBody } from '.././#Functions/FetchData';
import { ShareScreen } from './ShareScreen';
import { AccountOptions } from '.././#Components/AccountOptions';
import { SessionScreen } from './SessionScreen';
import { session } from '../#Components/responseInterfaces';

interface CreateScreenProps {
  onRequestClose(): void;
  joinId: string | undefined;
}
interface CreateScreenState {
  loginRequired: boolean;
  loginUrl: string | undefined;
  sessionId: string | undefined;
  joinName: string | undefined;
  sessionVisible: boolean;
  newJoinId: string | undefined;
}

export class CreateScreen extends React.Component<CreateScreenProps, CreateScreenState> {
  constructor(props: CreateScreenProps) {
    super(props);

    this.state = {
      loginRequired: true,
      loginUrl: undefined,
      sessionId: undefined,
      joinName: undefined,
      sessionVisible: false,
      newJoinId: undefined
    }
  }

  async componentDidMount() {
    await this.checkUserLoginStatus();
  }
  async checkUserLoginStatus() {
    try {
      const sessionIdStored = await AsyncStorage.getItem('sessionId');
      console.log("stored value: " + sessionIdStored);
      if (sessionIdStored !== null) {
        const authenticated = await checkLoginStatus(sessionIdStored, 0, 0);
        if (authenticated) {
          this.setState({ sessionId: sessionIdStored });
          this.setState({ loginRequired: false });
        } else {
          await this.getNewAuth();
        }
      } else {
        await this.getNewAuth();
      }
    } catch (error) {
      console.log(error);
      noServerConnection();
      setTimeout(() => this.checkUserLoginStatus(), 10000);
    }
  }

  async getNewAuth(){
    try {
      const authUrlResponse = await fetchFromBase('/spotify/auth/new',[200]);
      this.setState({ loginUrl: authUrlResponse.url, sessionId: authUrlResponse.sessionId });
      console.log("value to store: " + authUrlResponse.sessionId);
      await AsyncStorage.setItem('sessionId', authUrlResponse.sessionId);
      const loggedIn = await checkLoginStatus(authUrlResponse.sessionId, 0, 30);
      console.log("authentication was validated: " + loggedIn);
      if (loggedIn) this.setState({ loginRequired: false });
    } catch (error){
      console.log(error);
      noServerConnection();
    }
  }

  async createSession() {
    try{
      const createResponse :session = await fetchFromBaseWithBody(`/sessions`,'POST',{loginSessionId: this.state.sessionId, listeningSessionTitle: this.state.joinName});
      const joinId = createResponse.joinId;
      this.setState({ sessionVisible: true, newJoinId:joinId });
    } catch (error){
      console.log("CreateSession ERROR: " + error);
    }
  }

  render() {
    const { onRequestClose,joinId } = this.props;
    const { loginRequired, loginUrl, joinName, sessionVisible ,newJoinId} = this.state;
    if (loginRequired) {
      return (
        <Container>
          <Header>
            <Left>
              <Button transparent={true} onPress={() => onRequestClose()}>
                <Icon name='arrow-left' type='MaterialCommunityIcons' />
              </Button>
            </Left>
            <Body>
              <Title>Login Required</Title>
            </Body>
            <Right>
              <Image
                source={require('../SpotiFeteLogo.png')}
                style={{ width: 50, height: 50 }}
              />
            </Right>
          </Header>
          <Content padder>
            <H3 style={{ marginHorizontal: 10, textAlign: "center" }}>
              To continue please login to your Spotify Account first.
              </H3>
            <Form style={{ marginVertical: 10 }}>
              <Button block={true} style={{ marginVertical: 10, backgroundColor: 'black' }} disabled={!loginUrl}
                onPress={() => { Linking.openURL(loginUrl) }}
              >
                {loginUrl ? <React.Fragment /> : <Spinner />}
                <Text style={{ color: 'lightgreen' }}>Login</Text>
              </Button>
            </Form>
          </Content>
        </Container>
      );
    } else if (sessionVisible) {
      return (<SessionScreen adminMode={true} onRequestClose={() => { this.setState({ sessionVisible: false }); this.checkUserLoginStatus(); }} joinId={newJoinId}></SessionScreen>);
    }
    else {
      return (
        <Container>
          <Header>
            <Left>
              <Button transparent={true} onPress={() => onRequestClose()}>
                <Icon name='arrow-left' type='MaterialCommunityIcons' />
              </Button>
            </Left>
            <Body>
              <Title>Create a Session</Title>
            </Body>
            <Right>
              <Image
                source={require('../SpotiFeteLogo.png')}
                style={{ width: 50, height: 50 }}
              />
            </Right>
          </Header>
          <Content padder>
            <View>
              <H1>Your Session</H1>
              <Form style={{ marginVertical: 10 }}>
                <Item stackedLabel>
                  <Icon active name='account-group-outline' type='MaterialCommunityIcons' />
                  <Label>Session-Name</Label>
                  <Input
                    onChangeText={joinName => this.setState({ joinName })}
                    placeholder={"Name your Session"}
                    value={joinName}
                  />
                </Item>
                <Button block={true} style={{ marginVertical: 10 }} disabled={!(joinName)}
                  onPress={() => {
                    this.createSession();
                  }}>
                  {joinId ? <Text>Apply the changes</Text> : <Text>Let the Session start</Text> }
                </Button>
              </Form>
              <AccountOptions sessionId={this.state.sessionId} onOpenSession={(joinId) =>{ this.setState({ sessionVisible: true, newJoinId: joinId });}} onLogout={() => {this.setState({ loginRequired: true,loginUrl: undefined }); this.checkUserLoginStatus();}}></AccountOptions>
            </View>
          </Content>
        </Container>
      );
    }
  }
}