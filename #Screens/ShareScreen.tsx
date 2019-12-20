import * as React from 'react';
import { View,Container,Item, Label, Input, Toast,Header, Title, Form, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, Root, Spinner, H1, Picker, H3, List, ListItem, H2 } from 'native-base';
import { Image } from 'react-native-elements';
import { Linking , Clipboard } from 'react-native';
import AsyncStorage  from '@react-native-community/async-storage';
import {fetchFromBase,checkLoginStatus,noServerConnection} from '.././#Functions/FetchData';

interface ShareScreenProps {
  onRequestClose(): void;
  joinId: string;
}
interface ShareScreenState {
  stringToCopy: string | undefined;
  partyName: string | undefined;
}

export class ShareScreen extends React.Component<ShareScreenProps,ShareScreenState> {
  constructor (props:ShareScreenProps) {
    super(props);

    this.state = {
      stringToCopy : this.props.joinId,
      partyName : 'Micheal Jackson Party'
    }
  }

  async writeToClipboard () {
    await Clipboard.setString(this.state.stringToCopy);
    Toast.show({
      text: 'Copied to Clipboard!',
      buttonText: 'Okay',
      duration: 3000
    })
  }

  render() {
    const { onRequestClose } = this.props;
    const {partyName} = this.state;
    return (
    <Container>
        <Header>
        <Left> 
        <Button transparent={true} onPress={() => onRequestClose()}>
            <Icon name='arrow-left' type='MaterialCommunityIcons'/>
        </Button>
        </Left> 
        <Body>
        <Title>Share your Session</Title>
        </Body>
        <Right>
            <Image 
            source={require('../SpotiFeteLogo.png')}
            style={{ width: 50, height: 50 }}
            />
        </Right>
        </Header>
        <Content padder>
          {partyName ? <H2 style={{margin:10, textAlign:"center"}}>
            {partyName}
          </H2> : <Text>No name Session</Text>}
          <H3 style={{marginHorizontal:10, textAlign:"center"}}>
            Share your Sessions Id!
          </H3>
          <List style={{marginVertical: 20}}>
            <ListItem icon style={{borderWidth:1, borderColor: '#8600b3', paddingLeft:10}}>
              <Left><Text style={{  padding: 10}}>Id:</Text></Left>
            <Body>
              <Text style={{backgroundColor: "#8600b3", padding:9, color: 'lightgrey'}}>{this.props.joinId}</Text>
            </Body>
            <Right>
              <Icon style={{ color: "#8600b3"}} name='clipboard-text' type='MaterialCommunityIcons' onPress={() => {this.writeToClipboard()}}/>
            </Right>
            </ListItem>
          </List>
        </Content>
    </Container>
    );
   
  }
}