import { PersoniumCellUrl } from './common';

export type PersoniumToken = {
  access_token: string;
  refresh_token: string;
  token_type: 'Bearer';
  scope: string;
  expires_in: number;
  rerfresh_token_expires_in: number;
  id_token?: string;
  p_cookie_peer?: string;
  last_authenticated: number;
  failed_count: number;
};

type ROPCArgs = {
  username: string;
  password: string;
};

export const authWithROPC: (
  cellUrl: PersoniumCellUrl,
  args: ROPCArgs
) => Promise<PersoniumToken> = async (
  cellUrl: PersoniumCellUrl,
  args: ROPCArgs
) => {
  const { username, password } = args;

  const data = new URLSearchParams();
  data.set('grant_type', 'password');
  data.set('username', username);
  data.set('password', password);

  const res = await fetch(`${cellUrl.toString()}__token`, {
    credentials: 'include',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: data,
  });

  if (!res.ok) {
    throw {
      status: res.status,
      statusText: res.statusText,
    };
  }

  const result = await res.json();
  console.log(result);

  return result as PersoniumToken;
};
