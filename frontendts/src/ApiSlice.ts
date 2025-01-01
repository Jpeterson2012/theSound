import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { createSelector } from '@reduxjs/toolkit'
import type { TypedUseQueryStateResult } from '@reduxjs/toolkit/query/react'

interface Album {
    album_id: string
    images: []
    name: string
    release_date: string
    uri: string
    artists: []
    label_name: string
}
interface Playlists {
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

export type { Playlists }

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8888/auth' }),
    keepUnusedDataFor: 180,
    endpoints: builder => ({
        getAlbums: builder.query<Album[], void>({
            query: () => '/homepage2/albums'
        }),
        getPlaylists: builder.query<Playlists[], void>({
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

// type getPlaylistfromResultArg = TypedUseQueryStateResult<Playlists[],any,any>

// const selectOnePlaylist = createSelector(
//     (res: getPlaylistfromResultArg) => res.data,
//     (res: getPlaylistfromResultArg, userId: string) => userId,
//     (data, userId) => data?.filter(plist => plist.playlist_id === userId)
// )


export const { useGetAlbumsQuery, useGetPlaylistsQuery, useGetLikedQuery, useGetUserQuery } = apiSlice