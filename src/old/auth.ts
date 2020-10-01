import axios from 'axios';
import { PersoniumAccessToken } from './common.bk';

function composeFormBody(data: Record<string, string>) {
  return Object.entries(data)
    .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
    .join('&');
}

interface PersoiniumAuthHandler {
  loginAsync(): Promise<PersoniumAccessToken>;
  refreshAsync(): Promise<PersoniumAccessToken>;
  getAccessToken(): PersoniumAccessToken;
}

export class PersoniumLoginROPC {
  private _loginAsync: Promise<PersoniumAccessToken> | null = null;
  private _refreshAsync: Promise<unknown> | null = null;

  private _targetCell = '';
  private _username = '';
  private _password = '';
  private _httpsAgent: unknown = null;
  private _httpAgent: unknown = null;

  public constructor(
    targetCell: string,
    targetBoxName: string,
    username: string,
    password: string,
    { httpAgent, httpsAgent }: { httpAgent: unknown; httpsAgent: unknown }
  ) {
    this._targetCell = targetCell;
    this._username = username;
    this._password = password;
    this._httpAgent = httpAgent;
    this._httpsAgent = httpsAgent;
  }

  public async loginAsync(): Promise<PersoniumAccessToken> {
    if (this._loginAsync !== null) {
      console.log('`loginAsync` is already started');
      return this._loginAsync;
    }

    console.log('`loginAsync` is started newly');

    return (this._loginAsync = new Promise((resolve, reject) => {
      const data = new URLSearchParams();
      data.append('grant_type', 'password');
      data.append('username', this._username);
      data.append('password', this._password);
      console.log(data);

      axios(`${this._targetCell}__token`, {
        withCredentials: true,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: data,
        httpAgent: this._httpAgent,
        httpsAgent: this._httpsAgent,
        responseType: 'json',
      })
        .then(response => {
          this._loginAsync = null;
          resolve(response.data);
        })
        .catch(reject);
    }));
  }
}
