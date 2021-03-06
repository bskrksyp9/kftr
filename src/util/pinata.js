import { async } from 'q';

require('dotenv').config();
const key = "bd35f7d66f82f2c1855c";
const secret = "36f318167515b7f74afee518b2497c686c3f8a0a4e26cf69d7fc94d4594d02f0";
const axios = require('axios');



export const userPinList = async (queryParams) => {
    let queryString = '?';

    //Make sure keyvalues are properly formatted as described earlier in the docs.
    if (queryParams) {
        const stringKeyValues = JSON.stringify(queryParams);
        queryString = `metadata[keyvalues]=${stringKeyValues}`;
    }
    const url = `https://api.pinata.cloud/data/pinList?status=pinned&${queryString}`;

    console.log(url);
    return axios
        .get(url, {
            headers: {
                pinata_api_key: key,
                pinata_secret_api_key: secret
            }
        })
        .then(function (response) {
            //handle response here
            return {
                success: true,
                result: response.data.count
            };
        })
        .catch(function (error) {
            //handle error here
            console.log(error)
            return {
                success: false,
                message: error.message,
            }

        });
};

export const pinJSONToIPFS = async (JSONBody) => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    return axios
        .post(url, JSONBody, {
            headers: {
                pinata_api_key: key,
                pinata_secret_api_key: secret,
            }
        })
        .then(function (response) {
            console.log("data is sent to IPFS")
            return {
                success: true,
                pinataUrl: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
            };
        })
        .catch(function (error) {
            console.log(error)
            return {
                success: false,
                message: error.message,
            }

        });
};