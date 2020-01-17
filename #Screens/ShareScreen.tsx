import * as React from 'react';
import { View, Container, Item, Label, Input, Toast, Header, Title, Form, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, Root, Spinner, H1, Picker, H3, List, ListItem, H2 } from 'native-base';
import { Image } from 'react-native-elements';
import {  Clipboard,Linking } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

interface ShareScreenProps {
  onRequestClose(): void;
  joinId: string;
  sessionName: string | undefined;
}
interface ShareScreenState {
  stringToCopy: string | undefined;
}

export class ShareScreen extends React.Component<ShareScreenProps, ShareScreenState> {
  constructor(props: ShareScreenProps) {
    super(props);

    this.state = {
      stringToCopy: undefined
    }
  }

  async writeToClipboard(toCopy) {
    await Clipboard.setString(toCopy);
    Toast.show({
      text: `Copied to Clipboard! (${toCopy})`,
      buttonText: 'Okay',
      duration: 3000
    })
  }

  render() {
    const { onRequestClose, joinId ,sessionName} = this.props;
    const link = `spotifete://session/${joinId}`;
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent={true} onPress={() => onRequestClose()}>
              <Icon name='arrow-left' type='MaterialCommunityIcons' />
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
          {sessionName ? <H2 style={{ margin: 10, textAlign: "center" }}>
            {sessionName}
          </H2> : <React.Fragment/>}
          <H3 style={{ marginHorizontal: 10, textAlign: "center" }}>
            Share your Session Id!
          </H3>
          <View style={{ alignItems: 'center', padding: 10, borderWidth: 2, margin: 5 }}>
            <QRCode
              value={link}
              size={300}
            />
          </View>
          <List style={{ marginVertical: 20 }}>
            <ListItem thumbnail >
              <Left> 
                <Button onPress={() => { this.writeToClipboard(joinId) }}>
                  <Icon name='clipboard-text' type='MaterialCommunityIcons' />
              </Button></Left>
              <Body>
                <Text>Copy the Session Id</Text>
                <Text note>{joinId}</Text>
              </Body>
            </ListItem>
            <ListItem thumbnail >
              <Left> 
                <Button onPress={() => {this.writeToClipboard(link);}}>
                  <Icon name='clipboard-text' type='MaterialCommunityIcons' />
              </Button></Left>
              <Body>
                <Text>Copy the App-Link</Text>
                <Text note>{link}</Text>
              </Body>
            </ListItem>
          </List>
        </Content>
      </Container>
    );

  }
}