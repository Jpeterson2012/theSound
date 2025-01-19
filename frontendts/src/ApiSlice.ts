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
interface Playlists {
    playlist_id: string
    images: []
    name: string
    public: boolean
    uri: string
    tracks: any[]
}
interface pTrack {
    images: []
    uri: string
    name: string
    track_number: number
    duration_ms: string
    artists: []
}
interface Liked {
    tracks: any[]
}
interface likedSong{
    album_id: string
    images: []
    artists: []
    duration_ms: string
    uri: string
    name: string    
}
interface User {
    items: string
}

export type { Playlists }

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8888/auth' }),
    keepUnusedDataFor: 60 * 60,
    endpoints: builder => ({
        getAlbums: builder.query<Album[], void>({
            query: () => '/homepage2/albums'
        }),
        getPlaylists: builder.query<Playlists[], void>({
            query: () => '/homepage2/playlists'
        }),
        getPlaylist: builder.query<Playlists, string>({
            query: playId => `/homepage2/playlists/${playId}`
        }),
        addPTrack: builder.mutation<Playlists, {pID: any, initialP: pTrack}>({
            query: ({pID, initialP}) => ({
                url: `/update/playlist/${pID}`,
                method: 'POST',
                body: initialP
            }),
            async onQueryStarted({pID, initialP}, lifecycleApi){
                const getPPatchResult = lifecycleApi.dispatch(
                    apiSlice.util.updateQueryData('getPlaylists',undefined,draft => {
                        console.log(pID)
                        console.log(initialP)
                        const temp = draft.find(p => p.playlist_id === pID)
                        if (temp) temp.tracks.unshift(initialP)
                    })
                )
                try {
                    await lifecycleApi.queryFulfilled
                }
                catch{
                    getPPatchResult.undo()
                }
            }
        }),
        getLiked: builder.query<Liked, void>({
            query: () => '/homepage2/liked'
        }),
        addNewLiked: builder.mutation<Liked, likedSong>({
            query: initialSong => ({
                url: '/update/liked',
                method: 'POST',
                body: initialSong
            }),
            async onQueryStarted(initialSong, lifecycleApi){
                const getLikedPatchResult = lifecycleApi.dispatch(
                    apiSlice.util.updateQueryData('getLiked',undefined,draft => {
                        draft?.tracks?.unshift(initialSong)
                    })
                )
                try {
                    await lifecycleApi.queryFulfilled
                }
                catch{
                    getLikedPatchResult.undo()
                }
            }
        }),
        deletePTrack: builder.mutation<Playlists, {pID: any, name: any}>({
            query: ({pID, name}) => ({
                url: `/update/playlist/${pID}`,
                method: 'DELETE',
                body: {name}
            }),
            async onQueryStarted({pID, name}, lifecycleApi){
                const deletePTrackResult = lifecycleApi.dispatch(
                    apiSlice.util.updateQueryData('getPlaylists',undefined,draft => {
                        let temp = draft.find(p => p.playlist_id === pID)
                        if (temp) {
                            temp.tracks = temp.tracks.filter(a => a.name !== name)
                        } 
                    })
                )
                try{
                    await lifecycleApi.queryFulfilled
                }
                catch{
                    deletePTrackResult.undo()
                }
            }
        }),
        deleteNewLiked: builder.mutation<Liked, {name: any}>({
            query: ({name}) => ({
                url: '/update/liked',
                method: 'DELETE',
                body: {name}
            }),
            async onQueryStarted({name}, lifecycleApi){
                const deleteLikedPatchResult = lifecycleApi.dispatch(
                    apiSlice.util.updateQueryData('getLiked',undefined,draft => {            
                        console.log(name)            
                        let temp = draft?.tracks?.filter((a:any) => a.name !== name)                        
                        draft.tracks = [...temp]
                        // draft?.tracks?.filter((a:any) => a.name !== deleteSong.name)
                    })
                )
                try {
                    await lifecycleApi.queryFulfilled
                }
                catch{
                    deleteLikedPatchResult.undo()
                }
            }
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


export const { 
    useGetAlbumsQuery, 
    useGetPlaylistsQuery,
    useGetPlaylistQuery, 
    useGetLikedQuery, 
    useGetUserQuery,
    useAddNewLikedMutation,
    useAddPTrackMutation, 
    useDeleteNewLikedMutation,
    useDeletePTrackMutation,
} = apiSlice