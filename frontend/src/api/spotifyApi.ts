import type { AlbumDetails, Artist, ArtistDetails, SearchResult, Track } from "../types/spotify";
import apiClient from "./axiosConfig";

interface SpotifyPagedResponse<T> {
    href: string;
    items: T[];
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
}

interface ArtistTopTracksResponse {
    tracks: Track[];
}

const spotifyApi = {

    async getTopArtists(): Promise<Artist[]> {
        const response = await apiClient.get<Artist[]>('/spotify/me/top/artists');
        return response.data;
    },

    async getArtist(id: string): Promise<ArtistDetails> {
        const response = await apiClient.get<ArtistDetails>(`/spotify/artists/${id}`);
        return response.data;
    },

    async search(query: string, types: ('album' | 'artist' | 'track')[] = ['album', 'artist', 'track'], limit: number = 20): Promise<SearchResult> {
        const response = await apiClient.get<SearchResult>('/spotify/search', {
            params: {
                query: encodeURIComponent(query),
                type: types.join(','),
                limit
            }
        });
        return response.data;
    },

    async getAlbum(id: string): Promise<AlbumDetails> {
        const response = await apiClient.get<AlbumDetails>(`/spotify/albums/${id}`);
        return response.data;
    },

    async getArtistAlbums(
        id: string,
        includeGroups: string[] = ['album', 'single', 'compilation'],
        limit: number = 20,
        market?: string
    ): Promise<AlbumDetails[]> {
        const response = await apiClient.get<SpotifyPagedResponse<AlbumDetails>>(
            `/spotify/artists/${id}/albums`,
            {
                params: {
                    include_groups: includeGroups.join(','),
                    limit,
                    ...(market && { market })
                }
            }
        );

        return response.data.items;
    },

    async getArtistTopTracks(id: string): Promise<Track[]> {
        const response = await apiClient.get<ArtistTopTracksResponse>(`/spotify/artists/${id}/top-tracks`,);
        return response.data.tracks || [];
    }


}

export default spotifyApi;