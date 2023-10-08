import { resolve4 } from "dns";
import { isIPAddress } from "./validate-host";

export async function dnsResolve(hostname: string) {
  if (hostname === "localhost") {
    return "127.0.0.1";
  }

  if (isIPAddress(hostname)) {
    return hostname;
  }

  return new Promise<string>((resolve, reject) => {
    resolve4(hostname, (err, addresses) => {
      if (err) {
        return reject(err);
      }

      const [ip] = addresses;

      resolve(ip);
    });
  });
}
