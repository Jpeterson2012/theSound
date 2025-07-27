import {createContext} from 'react';


export const UsePlayerContext = createContext<any>({
    player: {},
    playerState: {},
    setPlayerState: () => {},
    is_active: false
});

export default UsePlayerContext