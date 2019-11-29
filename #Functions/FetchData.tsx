import { noServerConnection } from "./NoServerConnection";

export async function fetchData(url){
    const baseUrl = 'http://spotifete.nikos410.de/api/v1';
      try {
        const response = await fetch(baseUrl + url);
        const responseJson = await response.json();
        return responseJson;
      } catch (error) {
        console.log(error);
        noServerConnection(error);
      }
      
    return null;
  }