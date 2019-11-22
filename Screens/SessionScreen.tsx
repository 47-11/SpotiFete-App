import * as React from 'react';
import { Image } from 'react-native-elements';
import { View,Container, Header, Title, Subtitle, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, List, ListItem, H1, Label, Input, Item, Form } from 'native-base';
import { ScrollView } from 'react-native';

interface SessionScreenProps {
  sessionId: string;
  onRequestClose(): void;
}
interface SessionScreenState {
  songAddingActive: boolean;
  searchText: string;
}
interface song {
  Title: string;
  Interpret: string;
  active: boolean;
}

export class SessionScreen extends React.PureComponent<SessionScreenProps,SessionScreenState> {

  constructor (props:SessionScreenProps) {
    super(props);

    this.state = {
      songAddingActive: false,
      searchText : ""
    }
  }

  render() {
    const {songAddingActive,searchText} = this.state;
    const { sessionId, onRequestClose } = this.props;
    const playlist: song[] = [{Title: "The way you make me feel", Interpret:"Michael Jackson", active:false},{Title: "They don't care about us", Interpret:"Michael Jackson", active:false},{Title:  "Thriller", Interpret:"Michael Jackson", active:false},{Title:  "Bad", Interpret:"Michael Jackson", active:false},{Title:  "Smooth Criminal", Interpret:"Michael Jackson", active: true},{Title:  "Billie Jean", Interpret:"Michael Jackson", active:false},];
    const searchResult: song[] = [];
    const sessionName: string = "Michael Jackson Party";
    if(songAddingActive){
      return (
        <Container>
          <Header>
            <Left> 
              <Button transparent={true} onPress={() => this.setState({songAddingActive: false})}>
                <Icon name='arrow-left' type='MaterialCommunityIcons'/>
              </Button>
            </Left>
            <Body>
              <Title>Session - Add</Title>
            </Body>
            <Right>
              <Image
              source={require('../SpotiFeteLogo.png')}
              style={{ width: 50, height: 50 }}
              />
            </Right>
          </Header>
          <View padder >
            <View >
              <H1>{sessionName}</H1>
              <Form>
                <Item>
                  <Input
                  onChangeText={searchText => this.setState({ searchText })}
                  placeholder="Search"
                  /> 
                  <Icon active name='magnify' type='MaterialCommunityIcons' />
                </Item>
              </Form>
              <ScrollView style={{borderStyle:"solid",borderColor:'blue',  borderWidth:2,height:'65%'}}>
              <List>
                {searchResult.map((song,index) => {
                  return <ListItem style={{marginVertical:3}} selected={song.active} key={index}>
                    <Body>
                      <Text numberOfLines={1} >{song.Title}</Text>
                      <Text note>{song.Interpret}</Text>
                    </Body>
                  </ListItem>
                })}
              </List>
            </ScrollView>
            </View>
           
            <View style={{height:'20%'}} padder >
              <Button onPress={() => this.setState({songAddingActive: true})}>
                <Text>Add selected Songs and return to playlist</Text>
              </Button>
            </View>
          </View>
        </Container>
      );
    }
    else {
      return (
        <Container>
          <Header>
            <Left> 
              <Button transparent={true} onPress={() => onRequestClose()}>
                <Icon name='arrow-left' type='MaterialCommunityIcons'/>
              </Button>
            </Left>
            <Body>
              <Title>Session</Title>
            </Body>
            <Right>
              <Image
              source={require('../SpotiFeteLogo.png')}
              style={{ width: 50, height: 50 }}
              />
            </Right>
          </Header>
          <View padder >
            <View style={{height:'10%'}}>
              <H1>{sessionName}</H1>
            </View>
            <ScrollView style={{borderStyle:"solid",borderColor:'blue',  borderWidth:2,height:'65%'}}>
              <List>
                {playlist.map((song,index) => {
                  return <ListItem style={{marginVertical:3}} selected={song.active} key={index}>
                    <Body>
                      <Text numberOfLines={1} >{song.Title}</Text>
                      <Text note>{song.Interpret}</Text>
                    </Body>
                  </ListItem>
                })}
              </List>
            </ScrollView>
            <View style={{height:'25%'}} padder >
              <Button onPress={() => this.setState({songAddingActive: true})}>
                <Text>Add Song(s) to Playlist</Text>
              </Button>
            </View>
          </View>
        </Container>
      );
   }
  }
}