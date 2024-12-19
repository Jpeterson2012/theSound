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
    images: []
    duration_ms: number
    uri: string
    name: string
    artists: []
}

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8888/auth' }),
    endpoints: builder => ({
        getAlbums: builder.query<Album[], void>({
            query: () => '/homepage2/albums'
        })
    })
})

export const { useGetAlbumsQuery } = apiSlice