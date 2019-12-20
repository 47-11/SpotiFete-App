import * as React from 'react';
import { Image } from 'react-native-elements';
import { View, Container, Header, Title, Subtitle, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, List, ListItem, H1, Label, Input, Item, Form, Thumbnail, Toast } from 'native-base';
import { ScrollView } from 'react-native';
import { ShareScreen } from './ShareScreen';
import { fetchFromBase, fetchFromBaseWithBody, timeout } from '../#Functions/FetchData';
import { song, searchResponse, session, spotifyUser } from '../#Components/responseInterfaces';

interface SessionScreenProps {
  joinId: string;
  onRequestClose(): void;
  adminMode: boolean;
}
interface SessionScreenState {
  songAddingActive: boolean;
  sharingVisible: boolean;
  searchResult: song[];
  fetchSessionInterval: NodeJS.Timeout | undefined;
  curSession: session | undefined;
}

export class SessionScreen extends React.PureComponent<SessionScreenProps, SessionScreenState> {

  constructor(props: SessionScreenProps) {
    super(props);

    this.state = {
      songAddingActive: false,
      sharingVisible: false,
      searchResult: [],
      curSession: undefined,
      fetchSessionInterval: undefined
    }
  }

  async componentDidMount() {
    this.fetchSessionDetails();
    const fetchSessionInterval: NodeJS.Timeout  = setInterval(() => {
      this.fetchSessionDetails();
    }, 2000);
    this.setState({fetchSessionInterval:fetchSessionInterval});
  }

  async fetchSessionDetails() {
    console.log("Fetch Session details");
    const curJoinId = this.props.joinId;
    try {
      const sessionResponse: session = await fetchFromBase(`/sessions/${curJoinId}`);
      if (sessionResponse) {
        this.setState({ curSession: sessionResponse })
      }
    } catch (error) {
      console.log(error);
    }
  }
  async componentWillUnmount(){
    console.log("dont fetch anymore");
    clearInterval(this.state.fetchSessionInterval);
  }

  async searchSongs(query) {
    this.setState({ searchResult: [] });
    console.log("Seraching for songs query: " + query);
    let message = "";
    if (query == "") {
      message = 'Type in something'
    }
    try {
      const curJoinId = this.props.joinId;
      const response: searchResponse = await fetchFromBase(`/spotify/search/track?session=${curJoinId}&query=${query}&limit=15`);
      //(`spotify/search/track?session=${joinId}&query=${query}`);
      if (response.query == query && response.results && message == "") {
        this.setState({ searchResult: response.results });
      } else if (message == "") {
        message = 'Nothing found';
      }

    } catch (error) {
      console.log("searchSongs: " + error);
      message = error.message;
    }

    if (message != "") {
      Toast.show({
        text: message,
        buttonText: 'Okay',
        duration: 1000
      })
    }

  }

  async addSong(trackId) {
    const curJoinId = this.props.joinId;
    try {
      console.log("addSong: " + `/sessions/${curJoinId}/request POST: trackId:` + trackId);
      const addSongResponse = await fetchFromBaseWithBody(`/sessions/${curJoinId}/request`, 'POST', { trackId: trackId });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const { songAddingActive, sharingVisible, searchResult, curSession } = this.state;
    const { joinId, onRequestClose, adminMode } = this.props;
    let playlist: song[] = [];
    if (curSession) {
      if (curSession.currentlyPlaying) {
        curSession.currentlyPlaying.active = true;
        playlist.push(curSession.currentlyPlaying);
      }
      if (curSession.upNext && curSession.upNext.trackId !== "") playlist.push(curSession.upNext);
      if (curSession.queue) playlist = playlist.concat(curSession.queue);
    }
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
              {/* <H1>{curSession ? curSession.title : ""}</H1> */}
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
                      onPress={() => { this.addSong(song.trackId); this.setState({ songAddingActive: false }) }}
                    >
                      <Left>
                        {song.albumImageThumbnailUrl ?
                          <Thumbnail source={{ uri: song.albumImageThumbnailUrl }} /> :
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
            <H1>{curSession ? curSession.title : ""}</H1>
            <Text note>{curSession ? "by " + curSession.owner.spotifyDisplayName : ""}</Text>
              <View style={{ flexDirection: 'row' }}>
                <Button style={{ marginVertical: 10, width: '45%' }} onPress={() => this.setState({ sharingVisible: true })}>
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
                  return <ListItem style={{ marginVertical: 3 }}
                    key={index} thumbnail
                    selected={song.active}
                  >
                    <Left>
                      {song.albumImageThumbnailUrl ?
                        <Thumbnail source={{ uri: song.albumImageThumbnailUrl }} /> :
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