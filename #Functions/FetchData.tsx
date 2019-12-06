import { Toast } from "native-base";

export async function fetchFromBase(url){
    const baseUrl = 'http://spotifete.nikos410.de/api/v1';
      try {
        const response = await fetch(baseUrl + url);
        const responseJson = await response.json();
        return responseJson;
      } catch (error) {
        console.log(error);
        noServerConnection();
      }
      
    return null;
  }

  export async function checkLoginStatus(tillAuthenticated, sessionId){
    try {
      const fetchResponse = await fetchFromBase(`/spotify/auth/authenticated?sessionId=${encodeURIComponent(sessionId)}`);
      var authenticated = fetchResponse.authenticated;
      if (!authenticated && tillAuthenticated){
        setTimeout(() => checkLoginStatus(true,sessionId), 1000);
      }else if (authenticated) {
        return true;
      } else {
        return false;
      }
    } catch (e){
      console.log("checkLoginStatus failed: " + e);
    }
  }

  export function noServerConnection() {
    Toast.show({
        text: 'No Server Connection retry in 10 sec',
        buttonText: 'Okay',
        duration: 10000
      })
}
