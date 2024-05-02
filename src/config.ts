const REACT_APP_CHAIN_ID = process.env.REACT_APP_CHAIN_ID
const REACT_APP_CHAIN_RPC = process.env.REACT_APP_CHAIN_RPC
const REACT_APP_REALM_PATH  = process.env.REACT_APP_REALM_PATH 

if (!REACT_APP_CHAIN_ID) {
  throw new Error('REACT_APP_CHAIN_ID property not found in .env');
}

if (!REACT_APP_CHAIN_RPC) {
  throw new Error('REACT_APP_CHAIN_RPC property not found in .env');
}

if (!REACT_APP_REALM_PATH) {
  throw new Error('REACT_APP_REALM_PATH property not found in .env');
}

export default {
  CHAIN_ID: REACT_APP_CHAIN_ID,
  CHAIN_RPC: REACT_APP_CHAIN_RPC,
  REALM_PATH: REACT_APP_REALM_PATH
};
