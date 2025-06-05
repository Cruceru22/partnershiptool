import { organization } from "@acme/db";

export interface AffiliateAPI {
  platform: string;
  network: string;
  tokenType: string;
  token: string;
  apiSecret: any;
}

export const affiliateAPIs: AffiliateAPI[] = [
  {
    platform: "Radmor",
    network: "ShareASale",
    tokenType: "Token",
    token: "AKe6sy6a3DGawm7y",
    apiSecret: "RLu1qi3x3JVrfq4oAKe6sy6a3DGawm7y"
  },

  {
    platform: "Morningstar",
    network: "Awin",
    tokenType: "Access Token",
    token: "88228a50-7a0c-4880-9ceb-bc3f316dff0e",
    apiSecret: organization.awinKey
  },
  {
    platform: "Nextbase",
    network: "Impact",
    tokenType: "Account SID",
    token: "IRpMXtmuU3ey465402U4vnpuNyDnsQqq1",
    apiSecret: "20811"
  }
]; 