import React from "react";
import { View, H3, Button, Text } from "native-base";

interface propsAccount {
    sessionId: string;
}

export class AccountOptions extends React.PureComponent<propsAccount> {
    constructor (props:propsAccount) {
        super(props);
    }
    render() {
        return (
        <View padder style= {{borderColor:"#99ff99",backgroundColor:"black", borderWidth: 2, marginTop:50}}>
            <Text style={{color: "#99ff99"}}>You are currently logged in as ...</Text>
            <Button block={true} style={{marginVertical:10,borderColor:"#99ff99",backgroundColor:"black", borderWidth: 2}}>
                <Text style={{color: "#99ff99"}}>Logout</Text>
            </Button>
        </View>
        
        );
    }
}