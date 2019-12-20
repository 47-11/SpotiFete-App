import { Toast } from "native-base";

export function getBaseUrl (){
  const baseUrl = 'http://spotifete.nikos410.de/api/v1';
  return baseUrl;
}

export async function fetchFromBase(url){
      const baseUrl = getBaseUrl();
      try {
        const response = await fetch(baseUrl + url);
        const responseJson = await response.json();
        return responseJson;
      } catch (error) {
        console.log("fetchFromBase failed for query - " + baseUrl + url + " - : " + error);
        noServerConnection();
      }
      
    return null;
}

export async function fetchFromBaseWithBody (url, method, bodyParams){
  const baseUrl = getBaseUrl();
  try {
    fetch(baseUrl + url, {
      method: method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyParams),
    });
  }catch (error) {
    console.log("fetchFromBaseWithBody failed: " + error);
    noServerConnection();
  }
}
export async function checkLoginStatus( sessionId, tryout, maxTrys){
  try {
    console.log("checkLoginStatus already checked " + tryout + "times");
    const fetchResponse = await fetchFromBase(`/spotify/auth/authenticated?sessionId=${encodeURIComponent(sessionId)}`);
    var authenticated = fetchResponse.authenticated;
    if (!authenticated && tryout < maxTrys){
      console.log("checkLoginStatus: not authenticated" );
      await timeout(2000);
      return checkLoginStatus(sessionId,++tryout, maxTrys);
    }else if (authenticated) {
      console.log("checkLoginStatus: authenticated" );
      return true;
    } else {
      console.log("checkLoginStatus: not authenticated checked " +  ++tryout + "times");
      return false;
    }
  } catch (e){
    console.log("checkLoginStatus failed: " + e);
  }
}

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function sleep(fn, ...args) {
  await timeout(3000);
  return fn(...args);
}

export function noServerConnection() {
  Toast.show({
      text: 'Server-Error maybe no connection',
      buttonText: 'Okay',
      duration: 10000
    })
}
