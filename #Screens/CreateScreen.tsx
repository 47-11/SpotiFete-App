import * as React from 'react';
import { View,Container,Item, Label, Input, Toast,Header, Title, Form, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, Root, Spinner } from 'native-base';
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
}

export class CreateScreen extends React.Component<CreateScreenProps,CreateScreenState> {
  constructor (props:CreateScreenProps) {
    super(props);

    this.state = {
      loginRequired:true,
      loginUrl: undefined,
      sessionId: undefined
    }
  }
  
  async componentDidMount(){
    try {
      const authUrlResponse = await fetchData('/authurl/new');
      this.setState({loginUrl: authUrlResponse.url, sessionId: authUrlResponse.state});
    } catch (error) {
      console.log(error);
    }
    setTimeout(() => this.checkLoginStatus(), 1000);
  }

  async checkLoginStatus(){
    var loginInProcess = false;
    if (loginInProcess){
      setTimeout(() => this.checkLoginStatus(), 1000);
    }else {
      this.setState({loginRequired: false})
    }
    return false;
  }


  render() {
    const { onRequestClose } = this.props;
    const {loginRequired,loginUrl} = this.state;
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
          </Content>
        </Container>
      );
    }
  }
}