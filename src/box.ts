import { PersoniumCellUrl } from './common';

export interface GetBoxListResult {
  d: BoxList;
}

export interface BoxList {
  results: Array<BoxItem>;
  __count: string;
}

type PersoniumDate = string;

export interface BoxItem {
  __metadata: BoxMetadata;
  __published: PersoniumDate;
  __updated: PersoniumDate;
  Name: string;
  Schema: string | null;
}

interface BoxMetadata {
  uri: string;
  etag: string;
  type: string;
}

export async function getBoxList(
  cellUrl: PersoniumCellUrl,
  access_token: string
): Promise<GetBoxListResult> {
  const res = await fetch(`${cellUrl.toString()}__ctl/Box`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${access_token}`,
      Accept: 'application/json',
    },
  });

  const jsonData = await res.json();
  return jsonData as GetBoxListResult;
}
