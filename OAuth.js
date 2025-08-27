// Live Google OAuth Demo (Client-side using PKCE)
// Requires a Google OAuth 2.0 Web Client ID configured to use http://localhost:3000 as redirect URI

import React, { useEffect, useState } from 'react';

const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID';
const REDIRECT_URI = 'http://localhost:3000';
const SCOPE = 'openid email profile';
const AUTH_ENDPOINT = 'https://accounts.google.com/o/oauth2/v2/auth';
const TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';

const generateRandomString = (length = 128) => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  let result = '';
  const cryptoObj = window.crypto || window.msCrypto;
  const randomValues = new Uint32Array(length);
  cryptoObj.getRandomValues(randomValues);
  for (let i = 0; i < length; i++) {
    result += charset[randomValues[i] % charset.length];
  }
  return result;
};

const sha256 = async (plain) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  const hash = await window.crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(hash)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

const GoogleOAuth = () => {
  const [user, setUser] = useState(null);

  const login = async () => {
    const codeVerifier = generateRandomString();
    const codeChallenge = await sha256(codeVerifier);

    sessionStorage.setItem('code_verifier', codeVerifier);

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      scope: SCOPE,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    });

    window.location = `${AUTH_ENDPOINT}?${params.toString()}`;
  };

  const getAccessToken = async (code) => {
    const codeVerifier = sessionStorage.getItem('code_verifier');

    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      code_verifier: codeVerifier,
    });

    const res = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
    const data = await res.json();
    return data.access_token;
  };

  const fetchUserInfo = async (accessToken) => {
    const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const profile = await res.json();
    setUser(profile);
  };

  useEffect(() => {
    const url = new URL(window.location);
    const code = url.searchParams.get('code');

    if (code) {
      getAccessToken(code).then(fetchUserInfo);
    }
  }, []);

  return (
    <div className="p-4">
      {!user ? (
        <button onClick={login} className="bg-blue-500 text-white px-4 py-2 rounded">
          Login with Google
        </button>
      ) : (
        <div className="mt-4">
          <h2 className="text-xl font-bold">Welcome, {user.name}</h2>
          <p>Email: {user.email}</p>
          <img src={user.picture} alt="avatar" className="rounded-full w-16 h-16 mt-2" />
        </div>
      )}
    </div>
  );
};

export default GoogleOAuth;
