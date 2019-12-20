import * as React from 'react';
import { Image } from 'react-native-elements';
import { View, Container, Header, Title, Subtitle, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, List, ListItem, H1, Label, Input, Item, Form, Thumbnail, Toast } from 'native-base';
import { ScrollView } from 'react-native';
import { ShareScreen } from './ShareScreen';
import { fetchFromBase, fetchFromBaseWithBody } from '../#Functions/FetchData';

interface SessionScreenProps {
  joinId: string;
  onRequestClose(): void;
  adminMode: boolean;
}
interface SessionScreenState {
  songAddingActive: boolean;
  sharingVisible: boolean;
  searchResult: song[];
}
interface song {
  albumImageUrl: string;
  albumName: string;
  artistName: string;
  trackId: string;
  trackName: string;
}

interface searchResponse {
  query: string;
  results: song[];
  message: string | undefined;
}

export class SessionScreen extends React.PureComponent<SessionScreenProps, SessionScreenState> {

  constructor(props: SessionScreenProps) {
    super(props);

    this.state = {
      songAddingActive: false,
      sharingVisible: false,
      searchResult: []
    }
  }

  async searchSongs(query) {
    
    ///spotify/search/track
    const joinId = this.props.joinId;
    var message = "";
    if(query == "") {
      message = 'Type in something'
    }
    console.log("Seraching for songs query: " + query);
    try {
      const curJoinId = this.props.joinId;
      const response: searchResponse  = await fetchFromBase(`/spotify/search/track?session=${curJoinId}&query=${query}&limit=15`);
      //(`spotify/search/track?session=${joinId}&query=${query}`);
      if (response.query == query && response.results && message == "") {
        this.setState({ searchResult: response.results });
      } else if (response.message && message == "") {
        console.log("Seraching failed: ");
        console.log(response.message);
        message = response.message;

      } else if (message == ""){
        message = 'Nothing found';
      }
      if (message != ""){
        this.setState({ searchResult: [] });
        Toast.show({
          text: message,
          buttonText: 'Okay',
          duration: 1000
        })
      }
    } catch (error) {
      console.log(error);
    }
    
  }

  async addSong (trackId){
    const curJoinId = this.props.joinId;
    try {
      const addSongResponse = await fetchFromBaseWithBody(`/sessions/${curJoinId}/request`,'POST', {trackId : trackId});
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const { songAddingActive, sharingVisible, searchResult } = this.state;
    const { joinId, onRequestClose, adminMode } = this.props;
    const playlist: song[] = [];
    const sessionName: string = "Michael Jackson Party";
    if (songAddingActive) {
      return (
        <Container>
          <Header>
            <Left>
              <Button transparent={true} onPress={() => this.setState({ songAddingActive: false })}>
                <Icon name='arrow-left' type='MaterialCommunityIcons' />
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
                    onChangeText={(searchText) => { this.searchSongs(searchText) }}
                    placeholder="Search"
                  />
                  <Icon active name='magnify' type='MaterialCommunityIcons' />
                </Item>
              </Form>
              <ScrollView style={{ borderStyle: "solid", borderColor: 'blue', borderWidth: 2, height: '80%' }}>
                <List >
                  {searchResult.map((song, index) => {
                    return <ListItem style={{ marginVertical: 3 }}
                      key={index} thumbnail
                      onPress={() => {this.addSong(song.trackId); this.setState({songAddingActive: false})}}
                    >
                      <Left>
                        {song.albumImageUrl ?
                          <Thumbnail source={{ uri: song.albumImageUrl }} /> :
                          <Thumbnail style={{ backgroundColor: 'lightgrey' }} source={{ uri: 'nothing' }} />
                        }
                      </Left>
                      <Body>
                        <Text numberOfLines={1} >{song.trackName}</Text>
                        <Text note numberOfLines={1}>{song.artistName}</Text>
                        <Text note numberOfLines={1} >{song.albumName}</Text>
                      </Body>
                    </ListItem>
                  })}
                </List>
              </ScrollView>
            </View>
          </View>
        </Container>
      );
    }
    else if (sharingVisible) {
      return (<ShareScreen onRequestClose={() => { this.setState({ sharingVisible: false }); }} joinId={joinId}></ShareScreen>);
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
            <View style={{ height: '15%' }}>
              <H1>{sessionName}</H1>
              <View style={{ flexDirection: 'row' }}>
                <Button style={{ marginVertical: 10, width: '45%' }} onPress={() => this.setState({sharingVisible:true})}>
                  <Text>Share</Text>
                  <Icon name='share' type='MaterialCommunityIcons'></Icon>
                </Button>
                {
                  adminMode ?
                    <Button style={{ marginVertical: 10, width: '45%', marginHorizontal: '5%' }}
                      onPress={() => onRequestClose()}
                    >
                      <Text>Edit</Text>
                      <Icon name='square-edit-outline' type='MaterialCommunityIcons'></Icon>
                    </Button>
                    : <React.Fragment></React.Fragment>
                }
              </View>
            </View>
            <ScrollView style={{ borderStyle: "solid", borderColor: 'blue', borderWidth: 2, height: '60%' }}>
              <List>
                {playlist.map((song, index) => {
                  return <ListItem style={{ marginVertical: 3 }} selected={song.active} key={index}>
                    <Body>
                      <Text numberOfLines={1} >{song.trackName}</Text>
                      <Text note>{song.artistName}</Text>
                    </Body>
                  </ListItem>
                })}
              </List>
            </ScrollView>
            <View style={{ height: '25%' }} padder >
              <Button onPress={() => this.setState({ songAddingActive: true })}>
                <Text>Add Song(s) to Playlist</Text>
              </Button>
            </View>
          </View>
        </Container>
      );
    }
  }
}