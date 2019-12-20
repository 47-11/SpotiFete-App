import React from "react";
import { View, H3, Button, Text } from "native-base";
import { fetchFromBaseWithBody, fetchFromBase } from "../#Functions/FetchData";
import AsyncStorage from "@react-native-community/async-storage";
import { spotifyUser } from "./responseInterfaces";


interface propsAccount {
    sessionId: string;
    onLogout() : void;
}
interface stateAccount {
    username: string | undefined;
}

export class AccountOptions extends React.PureComponent<propsAccount,stateAccount> {
    constructor (props:propsAccount) {
        super(props);

        this.state = {
            username : undefined
        }
    }
    async logoutUser(){
        try {
            console.log("logoutUser Id: " +  this.props.sessionId);
            await fetchFromBaseWithBody('/spotify/auth/invalidate', 'PATCH',{sessionId : this.props.sessionId});
            await AsyncStorage.removeItem('sessionId');
            this.props.onLogout();
        } catch(error) {
            console.log("logoutUser failed: " + error);
        }
    } 
    async componentDidMount(){
        try {
            const userResponse : spotifyUser = await fetchFromBase('/users/current?sessionId='+ this.props.sessionId);
            const spotifyDisplayName = userResponse.spotifyDisplayName;
            if (spotifyDisplayName) this.setState({username : spotifyDisplayName});
            console.log("getting Username Response: " + spotifyDisplayName); 
        } catch(error){
            console.log("getting Username failed: " + error); 
        }
    }
    render() {
        const {username} = this.state;
        return (
        <View padder style= {{borderColor:"#99ff99",backgroundColor:"black", borderWidth: 2, marginTop:50}}>
    <Text style={{color: "#99ff99"}}>You are currently logged in as {username ? username : 'unknown Username'}</Text>
            <Button block={true} onPress={() =>  this.logoutUser()} style={{marginVertical:10,borderColor:"#99ff99",backgroundColor:"black", borderWidth: 2}}>
                <Text style={{color: "#99ff99"}}>Logout</Text>
            </Button>
        </View>
        
        );
    }
}