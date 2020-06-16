import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { PersoniumAccessToken, PersoniumClient } from "./common";
import xpath from "xpath";
import { DOMParser } from "xmldom";

export type XMLElement = {
  localName: string;
  namespaceURI: string;
  textValue?: string | XMLElement;
  attributes?: unknown;
};

export type ACE = {
  principal: XMLElement;
  privileges: Array<XMLElement>;
};

export function composeXMLACL(acls: Array<ACE>): string {
  const baseStr = '<acl xmlns="DAV:" xmlns:p="urn:x-personium:xmlns"></acl>';
  const baseStrAce =
    '<ace xmlns="DAV:" xmlns:p="urn:x-personium:xmlns"><principal></principal><grant><privilege></privilege></grant></ace>';
  const select = xpath.useNamespaces({
    D: "DAV:",
    p: "urn:x-personium:xlmns",
  });

  const basedom = new DOMParser().parseFromString(baseStr);
  const aclNode = select("/D:acl", basedom, true) as Attr;

  for (const acl of acls) {
    const acedom = new DOMParser().parseFromString(baseStrAce);
    const { principal, privileges } = acl;
    const { namespaceURI, localName } = principal;
    (select("/D:ace/D:principal", acedom, true) as Attr).appendChild(
      acedom.createElementNS(namespaceURI, localName)
    );
    const privilegeNode = select(
      "/D:ace/D:grant/D:privilege",
      acedom,
      true
    ) as Attr;
    for (const privilege of privileges) {
      const { namespaceURI, localName } = privilege;
      privilegeNode.appendChild(
        acedom.createElementNS(namespaceURI, localName)
      );
    }
    aclNode.appendChild(acedom);
  }
  return basedom.toString();
}

// export async function setACL(
//   url: string,
//   access_token: string,
//   acl: Array<ACE>
// ): Promise<unknown> {
//   const result = await axios(url, {
//     // method: "acl",
//   });
//   return result;
// }

export async function statFile(
  client: PersoniumClient,
  url: string
): Promise<string> {
  const config = client.prepareConfig({
    // @ts-expect-error because there is not `PROPFIND` in Methods of axios
    method: "PROPFIND",
    headers: {
      // Accept: "text/plain",
      Depth: 0,
    },
    data:
      '<?xml version="1.0" encoding="utf-8"?><D:propfind xmlns:D="DAV:"><D:allpop/></D:propfind>',
  });
  console.log(config);
  const response = await axios(url, config);
  console.log(response);
  return response.data;
}

export async function updateProperty(
  client: PersoniumClient,
  url: string,
  access_token: string,
  { set, remove }: { set?: Array<XMLElement>; remove?: Array<XMLElement> }
): Promise<Array<XMLElement>> {
  const config = client.prepareConfig({ data: "" });

  const response = await axios(url, config);
  console.log(response);
  return [];
}
