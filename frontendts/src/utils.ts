export async function spotifyRequest(path: string): Promise<Response>;
export async function spotifyRequest(path: string, method: string): Promise<Response>;
export async function spotifyRequest(path: string, method: string, options: object): Promise<Response>;
export async function spotifyRequest(path: string, method?: string, options?: object): Promise<Response> {
    const BASE_URL = window.location.hostname === "localhost" 
        ? import.meta.env.VITE_URL 
        : import.meta.env.VITE_PROD_URL;

    const urlTest = /^https?:\/\//.test(path);

    const url = urlTest ? path : `${BASE_URL}${path}`;

    const token = sessionStorage.getItem("token");    

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