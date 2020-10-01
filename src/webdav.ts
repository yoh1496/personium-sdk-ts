import { PersoniumWebDAVContentUrl } from './common';

export async function getProperties(
  contentUrl: PersoniumWebDAVContentUrl,
  access_token: string
): Promise<string> {
  const res = await fetch(contentUrl.toString(), {
    method: 'PROPFIND',
    headers: {
      Authorization: `Bearer ${access_token}`,
      Depth: '1',
    },
  });

  console.log(res.status, res.headers);

  const xmlDat = await res.text();
  console.log(xmlDat);
  return xmlDat;
}
