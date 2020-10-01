export class PersoniumWebDAVContentUrl {
  private _boxUrl: PersoniumBoxUrl;
  private _contentPath: string;
  constructor(boxUrl: PersoniumBoxUrl, contentPath: string) {
    this._boxUrl = boxUrl;
    // "/aaa" -> "aaa"
    // "aaa/" -> "aaa"
    // "/aaa/" -> "aaa"
    this._contentPath = contentPath
      .split('/')
      .filter(item => item)
      .join('/');
    console.log('contentPath', this._contentPath);
  }

  toString(): string {
    return `${this._boxUrl.toString()}${this._contentPath}`;
  }
}

export class PersoniumBoxUrl {
  private _boxName: string;
  private _cellUrl: PersoniumCellUrl;
  constructor(cellUrl: PersoniumCellUrl, boxName: string) {
    this._boxName = boxName;
    this._cellUrl = cellUrl;
  }

  toString(): string {
    return `${this._cellUrl.toString()}${this._boxName}/`;
  }

  get BoxName(): string {
    return this._boxName;
  }
}

export class PersoniumCellUrl {
  private _cellUrl: string;
  private _cellName: string;
  private _unitFQDN: string;

  constructor(cellUrl: string) {
    this._cellUrl = cellUrl;
    // https://<cellName>.<unitUrl>/
    const cellfqdn = cellUrl.split('/')[2];
    this._cellName = cellfqdn.split('.')[0];
    this._unitFQDN = cellfqdn
      .split('.')
      .slice(1)
      .join('.');
  }

  get CellName(): string {
    return this._cellName;
  }

  get UnitFQDN(): string {
    return this._unitFQDN;
  }

  toString(): string {
    return this._cellUrl;
  }
}
