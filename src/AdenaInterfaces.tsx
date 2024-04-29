export interface AdenaGetAccount {
    code: number;
    status: string;
    type: string;
    message: string;
    data: AdenaDataContent;
}

export interface AdenaDataContent {
  status: string;
  address: string;
  coins: string;
  public_key: AdenaPublicKey;
  account_number: string;
  sequence: string;
  chainId: string;
}

export interface AdenaPublicKey {
  type: string;
  value: string;
}