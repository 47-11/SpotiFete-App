import * as React from 'react';
import { View,Container,Item, Label, Input, Toast,Header, Title, Form, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, Root, Spinner, H1, Picker } from 'native-base';
import { Image } from 'react-native-elements';
import { Linking } from 'react-native';
import {fetchData} from '.././#Functions/FetchData';

interface CreateScreenProps {
  onRequestClose(): void;
}
interface CreateScreenState {
  loginRequired: boolean;
  loginUrl: string | undefined;
  sessionId: string | undefined;
  joinName: string |undefined;
  selDefaultPlaylist : string | undefined;
}

export class CreateScreen extends React.Component<CreateScreenProps,CreateScreenState> {
  constructor (props:CreateScreenProps) {
    super(props);

    this.state = {
      loginRequired:true,
      loginUrl: undefined,
      sessionId: undefined,
      joinName : undefined,
      selDefaultPlaylist : "nolist"
    }
  }
  
  async componentDidMount(){
    try {
      const authUrlResponse = await fetchData('/spotify/auth/new');
      this.setState({loginUrl: authUrlResponse.url, sessionId: authUrlResponse.state});
    } catch (error) {
      console.log(error);
    }
    this.checkLoginStatus();
  }

  async checkLoginStatus(){
    try {
      const fetchResponse = await fetchData(`/spotify/auth/authenticated?sessionId=${encodeURIComponent(this.state.sessionId)}`);
      var loginInProcess = fetchResponse.authenticated;
      if (loginInProcess){
        setTimeout(() => this.checkLoginStatus(), 1000);
      }else {
        this.setState({loginRequired: false});
      }
    } catch (e){
      console.log(e);
    }
  }
  onValueChange2(value: string) {
    this.setState({
      selDefaultPlaylist: value
    });
  }

  render() {
    const { onRequestClose } = this.props;
    const {loginRequired,loginUrl,joinName,selDefaultPlaylist} = this.state;
    if (loginRequired){
      return (
        <Container>
          <Header>
          <Left> 
            <Button transparent={true} onPress={() => onRequestClose()}>
              <Icon name='arrow-left' type='MaterialCommunityIcons'/>
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
          <Text style={{marginHorizontal:10}}>
                To continue please login to your Spotify Account first.
              </Text>
            <Form  style={{marginVertical:10}}>
              <Button block={true} style={{marginVertical:10, backgroundColor:'black'}} disabled={!loginUrl}
                onPress={() => {Linking.openURL(loginUrl)}}
              >
                {loginUrl ? <React.Fragment/> : <Spinner/>}
                <Text style={{color:'lightgreen'}}>Login</Text>
              </Button>
            </Form>
          </Content>
        </Container>
      );
    } else {
      return (
        <Container>
          <Header>
          <Left> 
            <Button transparent={true} onPress={() => onRequestClose()}>
              <Icon name='arrow-left' type='MaterialCommunityIcons'/>
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
              <H1>Your Party's Session</H1>
              <Form style={{marginVertical:10}}>
                <Item stackedLabel>
                  <Icon active name='account-group-outline' type='MaterialCommunityIcons' />
                  <Label>Name</Label>
                  <Input
                  onChangeText={joinName => this.setState({ joinName })}
                  placeholder={"Name your party-session"}
                  />
                </Item>
                <Item picker>
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
                  <Picker.Item label="Select a playlist" value="nolist" color="lightgrey"/>
                  <Picker.Item label="Micheal Jackson" value="list1" />
                  <Picker.Item label="Deutscher Rap" value="list2" />
                  </Picker>
                </Item>
                <Button block={true} style={{marginVertical:10}} disabled={selDefaultPlaylist == "nolist" || !(joinName)}
                onPress={() => {}}>
                <Text>Let the party start</Text>
              </Button>
              </Form>
            </View>
          </Content>
        </Container>
      );
    }
  }
}