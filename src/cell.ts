// cell level

import { PersoniumCellUrl } from './common';
import { ODataResult } from './box';

export type ODataQueryParameters = {
  $select?: string;
  $expand?: string;
  $format?: string;
  $filter?: string;
  $inlinecoount?: string;
  $orderby?: string;
  $top?: string;
  $skip?: string;
  q?: string;
};

// "/Date(1486519006899)/"
type PersoniumUnixTime = string;

// Object {2}
export type ExtCellData = {
  __metadata: ExtCellMetadata;
  Url: string;
  __published: PersoniumUnixTime;
  __updated: PersoniumUnixTime;
  _Role: DeferredURI;
  _Relation: DeferredURI;
};

export type DeferredURI = {
  __deferred: {
    uri: string;
  };
};

// Object {3}
type ExtCellMetadata = {
  uri: string;
  etag: string;
  type: 'CellCtl.ExtCell';
};
// export async function getBoxUrl() {}

type GetExternalCellListResult = ODataResult<ExtCellData>;

export async function getExternalCellList(
  cellUrl: PersoniumCellUrl,
  access_token: string,
  params?: ODataQueryParameters
): Promise<GetExternalCellListResult> {
  const targetUrl = new URL(`${cellUrl.toString()}__ctl/ExtCell`);
  if (params) {
    if (params.$filter) targetUrl.searchParams.set('$filter', params.$filter);
  }
  const res = await fetch(targetUrl.toString(), {
    headers: {
      Authorization: `Bearer ${access_token}`,
      Accept: 'application/json',
    },
  });

  const jsonDat = await res.json();
  console.log(jsonDat);

  return {
    d: {
      results: jsonDat.d.results,
    },
  };
}

type GetExternalCellRoleListResut = ODataResult<RoleData>;

type RoleMetadata = {
  uri: string;
  etag: string;
  type: 'CellCtl.Role';
};

export type RoleData = {
  __metadata: RoleMetadata;
  Name: string;
  '_Box.Name': null | string;
  __published: PersoniumUnixTime;
  __updated: PersoniumUnixTime;
  _Box: DeferredURI;
  _Account: DeferredURI;
  _ExtCell: DeferredURI;
  _ExtRole: DeferredURI;
  _Relation: DeferredURI;
};

export async function getExternalCellRoleList(
  extCellData: ExtCellData,
  access_token: string,
  params?: ODataQueryParameters
): Promise<GetExternalCellRoleListResut> {
  const targetUrl = new URL(extCellData._Role.__deferred.uri);
  if (params) {
    if (params.$filter) targetUrl.searchParams.set('$filter', params.$filter);
  }
  const res = await fetch(targetUrl.toString(), {
    headers: {
      Authorization: `Bearer ${access_token}`,
      Accept: 'application/json',
    },
  });

  const jsonDat = await res.json();
  console.log(jsonDat);

  return {
    d: {
      results: jsonDat.d.results,
    },
  };
}
