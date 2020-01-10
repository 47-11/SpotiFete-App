import React from "react";
import { View, H3, Button, Text, List, ListItem, Thumbnail, Left, Body, Icon } from "native-base";
import { fetchFromBaseWithBody, fetchFromBase } from "../#Functions/FetchData";
import AsyncStorage from "@react-native-community/async-storage";
import { userDetails, session } from "./responseInterfaces";
import { ScrollView } from "react-native";


interface propsAccount {
    sessionId: string;
    onLogout(): void;
    onOpenSession(string): void;
}
interface stateAccount {
    username: string | undefined;
    activeSessions: session[];
}

export class AccountOptions extends React.PureComponent<propsAccount, stateAccount> {
    constructor(props: propsAccount) {
        super(props);

        this.state = {
            username: undefined,
            activeSessions: []
        }
    }
    async logoutUser() {
        try {
            console.log("logoutUser Id: " + this.props.sessionId);
            await fetchFromBaseWithBody('/spotify/auth/invalidate', 'PATCH', { sessionId: this.props.sessionId });
            await AsyncStorage.removeItem('sessionId');
            this.props.onLogout();
        } catch (error) {
            console.log("logoutUser failed: " + error);
        }
    }
    async componentDidMount() {
        try {
            const userResponse: userDetails = await fetchFromBase('/users/current?sessionId=' + this.props.sessionId, [200]);
            const spotifyDisplayName = userResponse.spotifyDisplayName;
            if (spotifyDisplayName) this.setState({ username: spotifyDisplayName });
            const userSessions = userResponse.listeningSessions;
            if (userSessions) this.setState({ activeSessions: userSessions });
            console.log("getting Username Response: " + spotifyDisplayName);
        } catch (error) {
            console.log("getting Username failed: " + error);
        }
    }
    render() {
        const { username, activeSessions } = this.state;
        const { onOpenSession } = this.props;
        return (
            <View padder style={{ marginTop: 50, height: 300 }}>
                <Text >You are currently logged in as {username ? username : 'unknown Username'}</Text>
                <Button block={true} onPress={() => this.logoutUser()} style={{ marginVertical: 10, borderWidth: 2 }}>
                    <Text>Logout</Text>
                </Button>
                <Text >{activeSessions.length} active Sessions:</Text>

                <ScrollView>
                    <List >
                        {activeSessions.map((session, index) => {
                            return <ListItem style={{ marginVertical: 3, marginHorizontal: 5 }}
                                key={index}
                                onPress={() => onOpenSession(session.joinId)} avatar>
                                <Left>
                                    <Icon name='arrow-right-drop-circle' type='MaterialCommunityIcons'/> 
                                </Left>
                                <Body>
                                    <Text numberOfLines={1} >{session.title}</Text>
                                </Body>
                            </ListItem>
                        })}
                    </List>
                </ScrollView>
            </View>

        );
    }
}