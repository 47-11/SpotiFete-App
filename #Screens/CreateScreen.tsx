import * as React from 'react';
import { View, Container, Item, Label, Input, Toast, Header, Title, Form, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, Root, Spinner, H1, Picker, H3 } from 'native-base';
import { Image } from 'react-native-elements';
import { Linking } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { fetchFromBase, checkLoginStatus, noServerConnection } from '.././#Functions/FetchData';
import { ShareScreen } from './ShareScreen';
import { AccountOptions } from '.././#Components/AccountOptions';
import { SessionScreen } from './SessionScreen';

interface CreateScreenProps {
  onRequestClose(): void;
  joinId: string | undefined;
}
interface CreateScreenState {
  loginRequired: boolean;
  loginUrl: string | undefined;
  sessionId: string | undefined;
  joinName: string | undefined;
  selDefaultPlaylist: string | undefined;
  sessionVisible: boolean;
}

export class CreateScreen extends React.Component<CreateScreenProps, CreateScreenState> {
  constructor(props: CreateScreenProps) {
    super(props);

    this.state = {
      loginRequired: true,
      loginUrl: undefined,
      sessionId: undefined,
      joinName: undefined,
      selDefaultPlaylist: "nolist",
      sessionVisible: false
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
      const authUrlResponse = await fetchFromBase('/spotify/auth/new');
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
    return;
  }

  onValueChange2(value: string) {
    this.setState({
      selDefaultPlaylist: value
    });
  }

  render() {
    const { onRequestClose,joinId } = this.props;
    const { loginRequired, loginUrl, joinName, selDefaultPlaylist, sessionVisible } = this.state;
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
      return (<SessionScreen adminMode={true} onRequestClose={() => { this.setState({ sessionVisible: false }); this.checkUserLoginStatus(); }} joinId="123450"></SessionScreen>);
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
                {/* <Item picker>
                  <Icon active name='playlist-music' type='MaterialCommunityIcons' />
                  <Label>Default Playlist</Label>
                  <Picker
                    mode="dropdown"
                    iosIcon={<Icon name="arrow-down" type='MaterialCommunityIcons' />}
                    style={{ width: undefined }}
                    placeholderStyle={{ color: "#bfc6ea" }}
                    placeholderIconColor="#007aff"
                    selectedValue={selDefaultPlaylist}
                    onValueChange={this.onValueChange2.bind(this)}
                  >
                    <Picker.Item label="Select a playlist" value="nolist" color="lightgrey" />
                    <Picker.Item label="Micheal Jackson" value="list1" />
                    <Picker.Item label="Deutscher Rap" value="list2" />
                  </Picker>
                </Item> */}
                <Button block={true} style={{ marginVertical: 10 }} disabled={!(joinName)}
                  onPress={() => {
                    this.createSession();
                    this.setState({ sessionVisible: true });
                  }}>
                  {joinId ? <Text>Let the Session start</Text> : <Text>Apply the changes</Text>}
                </Button>
              </Form>
              <AccountOptions sessionId={this.state.sessionId} onLogout={() => {this.setState({ loginRequired: true,loginUrl: undefined }); this.checkUserLoginStatus();}}></AccountOptions>
            </View>
          </Content>
        </Container>
      );
    }
  }
}