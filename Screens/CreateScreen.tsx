import * as React from 'react';
import { View,Container,Item, Label, Input, Toast,Header, Title, Form, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, Root } from 'native-base';
import { Image } from 'react-native-elements';

interface CreateScreenProps {
  onRequestClose(): void;
}
interface CreateScreenState {
  username: string;
  password: string;
  loginRequired: boolean;
}

export class CreateScreen extends React.Component<CreateScreenProps,CreateScreenState> {
  constructor (props:CreateScreenProps) {
    super(props);

    this.state = {
      username: "",
      password: "",
      loginRequired:true
    }
  }
  render() {
    const { onRequestClose } = this.props;
    const {username,password,loginRequired} = this.state;
    if (loginRequired){
      return (
        <Root>
        <Container>
          <Header>
          <Left> 
            <Button transparent={true} onPress={() => onRequestClose()}>
              <Icon name='arrow-left' type='MaterialCommunityIcons'/>
            </Button>
          </Left> 
            <Body>
            <Title>Login</Title>
            </Body>
            <Right>
              <Image 
              source={require('../SpotiFeteLogo.png')}
              style={{ width: 50, height: 50 }}
              />
            </Right>
          </Header>
          <Content padder>
            <Form  style={{marginVertical:10}}>
              <Text style={{marginHorizontal:10}}>
                To create your own Session you have to login to your Spotify Account
                first.
              </Text>
              <Item floatingLabel>
                  <Label>Username</Label>
                  <Input
                  onChangeText={username => this.setState({ username })}
                  />
              </Item>
              <Item floatingLabel>
                  <Label>Password</Label>
                  <Input secureTextEntry={true}
                  onChangeText={password => this.setState({ password })}
                  />
                  <Icon active name='eye-outline' type='MaterialCommunityIcons' />
              </Item>
            </Form>
            <Button block={true} style={{marginVertical:10}} disabled={username == "" && password == ""}
                onPress={()=> Toast.show({
                  text: 'Wrong password!',
                  buttonText: 'Okay',
                  duration: 3000
                })}>
              <Text>Login</Text>
            </Button>
          </Content>
        </Container>
        </Root>
      );
    }
  }
}