
export interface song {
    albumImageThumbnailUrl: string;
    albumName: string;
    artistName: string;
    trackId: string;
    trackName: string;
}

export interface searchResponse {
    query: string;
    results: song[];
    message: string | undefined;
}

export interface session {
    owner: spotifyUser;
    joinId: string;
    title: string;
    currentlyPlaying: song | undefined;
    upNext: song | undefined;
    queue: song[] | undefined;
}

export interface spotifyUser {
    spotifyUser: string;
    spotifyDisplayName: string
}