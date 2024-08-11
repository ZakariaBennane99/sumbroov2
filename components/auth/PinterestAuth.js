// auth/PinterestAuth.js


const PINTEREST_OAUTH_URL = "https://www.pinterest.com/oauth/";
const REDIRECT_URI = 'https://sumbroo.com/auth/callback/pinterest';
const SCOPE = "boards:read,boards:write,pins:read,pins:write,user_accounts:read"; 
const STATE = "vXpd@aSf1nGdgfXTf"; 


export const PinterestAuth = () => {
    // Redirects the user to Pinterest&apos;s OAuth page.
    const initiateAuth = () => {
        const authURL = `${PINTEREST_OAUTH_URL}?client_id=1484362&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPE}&state=${STATE}`;
        window.location.href = authURL
    };

    // This function will handle the callback from Pinterest with the auth code.
    const handleAuthCallback = async (code) => {

        const headers = new Headers();
        headers.append("Authorization", `Basic ${btoa(`1484362:${process.env.PINTEREST_APP_SECRET}`)}`);
        headers.append("Content-Type", "application/x-www-form-urlencoded");

        const body = new URLSearchParams();
        body.append("grant_type", "authorization_code");
        body.append("code", code);
        body.append("redirect_uri", REDIRECT_URI);

        const response = await fetch("https://api.pinterest.com/v5/oauth/token", {
            method: "POST",
            headers: headers,
            body: body
        });

        const data = await response.json();

        console.log('The data from Pinterest', data)
        
        return data;

    };

    return { initiateAuth, handleAuthCallback };

};
