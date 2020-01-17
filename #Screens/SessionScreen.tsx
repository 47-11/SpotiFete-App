import * as React from 'react';
import { Image } from 'react-native-elements';
import { View, Container, Header, Title, Subtitle, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, List, ListItem, H1, Label, Input, Item, Form, Thumbnail, Toast, Spinner } from 'native-base';
import { ScrollView, Linking, AsyncStorage, Alert } from 'react-native';
import { ShareScreen } from './ShareScreen';
import { fetchFromBase, fetchFromBaseWithBody, timeout, noServerConnection } from '../#Functions/FetchData';
import { song, searchResponse, session, spotifyUser } from '../#Components/responseInterfaces';
import { CreateScreen } from './CreateScreen';

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
  editVisible: boolean;
  searchText: string ;
}

export class SessionScreen extends React.PureComponent<SessionScreenProps, SessionScreenState> {

  constructor(props: SessionScreenProps) {
    super(props);

    this.state = {
      songAddingActive: false,
      sharingVisible: false,
      searchResult: [],
      curSession: undefined,
      fetchSessionInterval: undefined,
      editVisible: false,
      searchText: ''
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
    const curJoinId = this.props.joinId;
    try {
      const lastUpdate = await fetchFromBase(`/sessions/${curJoinId}/queuelastupdated`,[200]);
      if (!this.state.curSession || (this.state.curSession && lastUpdate && this.state.curSession.queueLastUpdated !== lastUpdate.queueLastUpdated)){
        console.log("Fetch Session details");

        const sessionResponse: session = await fetchFromBase(`/sessions/${curJoinId}`,[200]);
        if (sessionResponse) {
          this.setState({ curSession: sessionResponse })
        }
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
     return;
    }
    try {
      const curJoinId = this.props.joinId;
      
      const response: searchResponse = await fetchFromBase(`/spotify/search/track?session=${curJoinId}&query=${encodeURIComponent(query)}&limit=15`,[200]);
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

  async confirmDeletion(){
    Alert.alert(
      'Confirm',
      'You are about to delete this Session. Are you sure?',
      [
       
        {
          text: 'No I\'m not sure',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Yes! Trash it.', onPress: () => this.deleteSession()},
      ],
      {cancelable: false},
    );
  }

  async deleteSession(){
    const curJoinId = this.props.joinId;
    const loginSessionId = await AsyncStorage.getItem('sessionId');
    
    if(loginSessionId){
      try {
        console.log("deleteSession: " + `/sessions/${curJoinId} DELETE: loginSessionId:` + loginSessionId);
        await fetchFromBaseWithBody(`/sessions/${curJoinId}`, 'DELETE', { loginSessionId: loginSessionId });
        this.props.onRequestClose();
      } catch (error) {
        console.log("deleteSession ERROR: " + error);
      }
    } else {
      console.log("no Id stored" );
    }
  }

  async addSong(trackId) {
    const curJoinId = this.props.joinId;
    try {
      console.log("addSong: " + `/sessions/${curJoinId}/request POST: trackId:` + trackId);
      await fetchFromBaseWithBody(`/sessions/${curJoinId}/request`, 'POST', { trackId: trackId });
    } catch (error) {
      console.log("addSong ERROR: " + error);
    }
  }

  openSpotify(plalistId){
    const spotifyLink = `spotify://playlist/${plalistId}`;
    try {
    Linking.canOpenURL(spotifyLink).then((spotifyInstalled => {
      if(spotifyInstalled){
        Linking.openURL(spotifyLink);
      } else {
        Linking.openURL(`https://open.spotify.com/playlist/${plalistId}`);
      }
    })); 
  } catch(error){
    console.log(error);
    noServerConnection();
  }
    
  }

  render() {
    const { songAddingActive, sharingVisible, searchResult, curSession,editVisible,searchText } = this.state;
    const { joinId, onRequestClose, adminMode } = this.props;
    let playlist: song[] = [];
    if (curSession) {
      if (curSession.currentlyPlaying && curSession.currentlyPlaying.trackId !== "") {
        curSession.currentlyPlaying.active = true;
        playlist.push(curSession.currentlyPlaying);
        if (curSession.upNext && curSession.upNext.trackId !== ""){ 
          playlist.push(curSession.upNext);
        }
      } 
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
                    onChangeText={(searchText) => { this.setState({searchText:searchText}) }}
                    value={searchText}
                    placeholder="Search"
                    onEndEditing={() => this.searchSongs(searchText)}
                    returnKeyType={"search"}
                  />
                  <Button  onPress={() => {this.searchSongs(searchText);}}>
                     <Icon active name='magnify' type='MaterialCommunityIcons'/> 
                  </Button>
                  
                </Item>
              </Form>
              <ScrollView>
                <List >
                  {searchResult.map((song, index) => {
                    return <ListItem style={{ marginVertical: 3, marginHorizontal:5 }}
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
      return (<ShareScreen onRequestClose={() => { this.setState({ sharingVisible: false }); }} joinId={joinId} sessionName={curSession.title}></ShareScreen>);
    } else if (editVisible) {
      return(<CreateScreen joinId={joinId} onRequestClose={() => { this.setState({ editVisible: false }); }}></CreateScreen>)
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
            <View style={{ height: '15%',margin: 20 }}>
            {curSession ? <H1 numberOfLines={2}>{curSession.title}</H1> : <Spinner color={'black'}></Spinner>}
            <Text note>{curSession ? "by " + curSession.owner.spotifyDisplayName : "..."}</Text>
              <View style={{ flexDirection: 'row' }}>
                <Button style={{ marginVertical: 5, width: '45%', marginRight: '5%' }} onPress={() => this.setState({ sharingVisible: true })}>
                  <Text>Share</Text>
                  <Icon name='share' type='MaterialCommunityIcons'></Icon>
                </Button>
                {
                  adminMode ?
                <Button style={{ marginVertical: 5, width: '50%' }} onPress={() => this.confirmDeletion()}>
                  <Text>Delete</Text>
                  <Icon name='trash-can-outline' type='MaterialCommunityIcons'></Icon>
                </Button>
                : <React.Fragment/>
                }
              </View>
            </View>
            <ScrollView style={{height:'65%',  marginTop:5, padding:5}}>
              <List>
                {playlist.length > 0 ? playlist.map((song, index) => {
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
                }) : <React.Fragment></React.Fragment>}
              </List>
            </ScrollView>
            <View style={{ height: '20%' ,flexDirection: 'row', marginBottom: '20%'}} padder >
              <Button onPress={() => this.setState({ songAddingActive: true }) } style={{ marginRight: '5%', marginVertical: 5 , width: '45%'}}>
                <Text>Add a Song</Text>
              </Button>
              {
                  adminMode ?
                    <Button style={{  marginVertical: 5 , width: '50%'}}
                      onPress={() => {this.openSpotify(curSession.spotifyPlaylist)}}
                    >
                      <Text>To Playlist</Text>
                      <Icon name='spotify' type='MaterialCommunityIcons'></Icon>
                    </Button>
                    : <React.Fragment></React.Fragment>
                }
            </View>
          </View>
        </Container>
      );
    }
  }
}