import {useState, useEffect, useRef} from 'react';
import { spotifyRequest } from '../utils';

export default function useAuth(){
    const [auth, setAuth] = useState({
        access_token: null,
        refresh_token: null,
    });
    const timeoutRef = useRef<any>(null);    

    const tokenManager = async () => {
        try{                
            const response = await spotifyRequest("/token");
            const data = await response.json();
            
            setAuth({
                access_token: data.access_token,
                refresh_token: data.refresh_token
            });                                   
            
            sessionStorage.setItem("token", data.access_token);                

            scheduleRefresh(data.expires_in, data.refresh_token);
        }
        catch(e){
            console.error(`Error requesting access token: ${e}`);
            //window.location.href = '/';
            clearTimeout(timeoutRef.current);

            timeoutRef.current = setTimeout(tokenManager, 5000);
        }
    };

    const scheduleRefresh = (expires: any, refresh: any) => {
        clearTimeout(timeoutRef.current);

        const refreshTime = (expires - 60) * 1000;

        timeoutRef.current = setTimeout(() => refreshAccessToken(refresh), refreshTime);
    };

    const refreshAccessToken = async (refresh: any) => {
        console.log(refresh)
        try{
            await spotifyRequest("/token/refresh_token", "POST", {
                body: JSON.stringify({refresh_token: refresh})
            })
            .then(data => data.json())
            .then(item => {                                
                sessionStorage.setItem("token", item.token);

                setAuth({                        
                    access_token: item.access_token,        
                    refresh_token: refresh,
                });     
                
                scheduleRefresh(item.expires_in, refresh);
            });
        } catch (e) {
            console.error(`Error requesting access token: ${e}`);

            clearTimeout(timeoutRef.current);

            timeoutRef.current = setTimeout(() => refreshAccessToken(refresh), 10000);
        }
    };

    useEffect(() => {              
        tokenManager();

        return () => clearTimeout(timeoutRef.current);
    }, []);    

    return auth.access_token;
};