import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

interface Album {
    album_id: string
    images: []
    name: string
    release_date: string
    uri: string
    artists: []
    label_name: string
}
interface Playlist {
    playlist_id: string
    images: []
    name: string
    public: boolean
    uri: string
    tracks: []
}
interface Liked {
    tracks: []
}
interface User {
    items: string
}

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8888/auth' }),
    endpoints: builder => ({
        getAlbums: builder.query<Album[], void>({
            query: () => '/homepage2/albums'
        }),
        getPlaylists: builder.query<Playlist[], void>({
            query: () => '/homepage2/playlists'
        }),
        getLiked: builder.query<Liked, void>({
            query: () => '/homepage2/liked'
        }),
        getUser: builder.query<User, void>({
            query: () => '/users'
        })
    })
})

export const { useGetAlbumsQuery, useGetPlaylistsQuery, useGetLikedQuery, useGetUserQuery } = apiSlice