export function storeToken(token: string, tokenType: string) {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('access_token', token);
    sessionStorage.setItem('token_type', tokenType);
  }
}

export function getToken(): { accessToken: string; tokenType: string } | null {
  if (typeof window === 'undefined') return null;
  
  const accessToken = sessionStorage.getItem('access_token');
  const tokenType = sessionStorage.getItem('token_type');

  if (accessToken && tokenType) {
    return { accessToken, tokenType };
  }
  return null;
}

export function removeToken() {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('token_type');
  }
}

export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

