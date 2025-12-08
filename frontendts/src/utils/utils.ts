import { resetInactivityTimer } from "./authTimer.ts";
import { store } from "../App/store.ts";

export async function spotifyRequest(path: string): Promise<Response>;
export async function spotifyRequest(path: string, method: string): Promise<Response>;
export async function spotifyRequest(path: string, method: string, options: object): Promise<Response>;
export async function spotifyRequest(path: string, method?: string, options?: object): Promise<Response> {    
    const playing = store.getState().defaultState.playing;    

    if (path !== "/player" || playing) {        
        resetInactivityTimer();
    }    
    
    const BASE_URL = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") 
        ? import.meta.env.VITE_URL 
        : import.meta.env.VITE_PROD_URL;

    const urlTest = /^https?:\/\//.test(path);

    const url = urlTest ? path : `${BASE_URL}${path}`;

    const token = store.getState().defaultState.authToken;    

    return await fetch(url, {
        method: method ?? 'GET',
        headers: {
            "Content-Type":"application/json",
            ...(urlTest && {Authorization: 'Bearer ' + token}),
        },
        ...(!urlTest && {credentials: "include"}),
        ...options,                
    });
};

export const BASE_URL = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") 
    ? import.meta.env.VITE_URL 
    : import.meta.env.VITE_PROD_URL;

export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);

  max = Math.floor(max);
  
  return (Math.floor(Math.random() * (max - min + 1)) + min).toLocaleString();
};

export function msToReadable(ms: number) {
    const totalSeconds = Math.floor(ms / 1000);

  const hours = Math.floor(totalSeconds / 3600);

  const minutes = Math.floor((totalSeconds % 3600) / 60);

  const seconds = totalSeconds % 60;

  if (hours) {    
    return `${hours} ${hours === 1 ? "hr" : "hrs"} ${minutes ? minutes : ""} ${minutes ? (minutes === 1 ? "min" : "mins") : ""}`;
  }

  return `${minutes} min ${seconds ? seconds : ""} ${seconds ? (seconds === 1 ? "sec" : "secs") : ""}`;
};

export function timeCalc (ms: number) {
    const temp = Math.round(ms / 1000);

    let mins = Math.floor(temp / 60);

    let secs = temp - mins * 60;

    secs > 59 && (mins += 1, secs -= 60);

    (secs.toString().length === 1 && secs > 5) && (mins += 1, secs -= 6);

    if (secs.toString().length == 1) return `${mins}:${secs}0`;

    else return `${mins}:${secs}`;
};

export const stockImage = "https://images.inc.com/uploaded_files/image/1920x1080/getty_626660256_2000108620009280158_388846.jpg";