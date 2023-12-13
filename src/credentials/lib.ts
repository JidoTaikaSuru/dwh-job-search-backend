import { VerifiableCredential } from "@veramo/core";
import { agent } from "../setup.js";
import { promises as dns } from "dns";

export const storeCredential = async (
  verifiableCredential: VerifiableCredential,
) => {
  console.log("Storing credential", verifiableCredential);
  const vcHash = await agent
    .dataStoreSaveVerifiableCredential({ verifiableCredential })
    .catch((e) => {
      console.log("Error saving verifiable credential to data store");
      console.error(e);
    });
  console.log("Saved VC to data store, hash:", vcHash);
};

export function isDateInPastWeek(dateString: string): boolean {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7); // Set the date to 7 days ago
  oneWeekAgo.setHours(0, 0, 0, 0); // Set time to start of the day

  const inputDate = new Date(dateString);
  inputDate.setHours(0, 0, 0, 0); // Set time to start of the day

  return inputDate >= oneWeekAgo;
}

export async function nslookup(domain: string): Promise<string[]> {
  try {
    const addresses = await dns.resolve4(domain);
    return addresses;
  } catch (error) {
    console.error(`Error occurred: ${error}`);
    return [];
  }
}

const mainstreamDnsProviders = [
  "8.8.8.8",
  "8.8.4.4", //Google
  "1.1.1.1",
  "1.0.0.1", //Cloudflare
  "208.67.222.222",
  "208.67.220.220", //OpenDNS
  "9.9.9.9",
  "149.112.112.112", //Quad9
  "4.2.2.1",
  "4.2.2.2",
  "4.2.2.3",
  "4.2.2.4",
  "4.2.2.5",
  "4.2.2.6", //Level3
  "8.26.56.26",
  "8.20.247.20", //Comodo
  "64.6.64.6",
  "64.6.65.6",
]; //Verisign
// Not secure, easy to spoof, but signals intent for the hackathon
export async function usesMainstreamDnsProvider(
  domain: string,
): Promise<boolean> {
  const addresses = await nslookup(domain);
  return addresses.some((address) => mainstreamDnsProviders.includes(address));
}

export const stripDidPrefix = (did: string): string | undefined => {
  const regex = /did:([a-zA-Z]+:){1,}(.*)/; //TODO, not perfect, incompat with several did types, has pitfalls
  const match = did.match(regex);
  return match ? match[2] : undefined;
};
