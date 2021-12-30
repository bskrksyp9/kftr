import { pinJSONToIPFS, userPinList } from "./pinata.js";
require("dotenv").config();
const alchemyKey = "https://eth-ropsten.alchemyapi.io/v2/R0lxwcS27X5gH640_IhTltKUlwTGKQEx";
const contractABI = require("../contract-abi.json");
const contractAddress = "0x4C4a07F737Bf57F6632B6CAB089B78f62385aCaE";
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const obj = {
        status: "👆🏽 ಮೇಲಿನ ಪಠ್ಯ ಕ್ಷೇತ್ರದಲ್ಲಿ ಸಂದೇಶವನ್ನು ಬರೆಯಿರಿ.",
        address: addressArray[0],
      };
      return obj;
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" href={`https://metamask.io/download.html`}>
              ನೀವು ಮೆಟಾಮಾಸ್ಕ್, (ವರ್ಚುವಲ್ ಇಥಿರಿಯಮ್ ವಾಲೆಟ್) ಅನ್ನು
ಬ್ರೌಸರ್ ಜೊತೆಗೆ ಸ್ಥಾಪಿಸಬೇಕು !
            </a>
          </p>
        </span>
      ),
    };
  }
};

export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (addressArray.length > 0) {
        return {
          address: addressArray[0],
          status: "👆🏽 ಮೇಲಿನ ಪಠ್ಯ ಕ್ಷೇತ್ರದಲ್ಲಿ ಸಂದೇಶವನ್ನು ಬರೆಯಿರಿ.",
        };
      } else {
        return {
          address: "",
          status: "🦊 ಮೇಲಿನ ಬಲ ಬಟನ್ ಅನ್ನು ಬಳಸಿಕೊಂಡು ಮೆಟಾಮಾಸ್ಕ್‌ಗೆ ಸಂಪರ್ಕಪಡಿಸಿ.",
        };
      }
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" href={`https://metamask.io/download.html`}>
              ನೀವು ಮೆಟಾಮಾಸ್ಕ್, (ವರ್ಚುವಲ್ ಇಥಿರಿಯಮ್ ವಾಲೆಟ್) ಅನ್ನು
  ಬ್ರೌಸರ್ ಜೊತೆಗೆ ಸ್ಥಾಪಿಸಬೇಕು !
            </a>
          </p>
        </span>
      ),
    };
  }
};

async function loadContract() {
  return new web3.eth.Contract(contractABI, contractAddress);
}

export const mintNFT = async (url, name, name2, description) => {
  if (url.trim() === "" || name.trim() === "" || name2.trim() === "" || description.trim() === "") {
    return {
      success: false,
      status: "ದಯವಿಟ್ಟು ಎಲ್ಲಾ ಪಠ್ಯ ಕ್ಷೇತ್ರಗಳು ಪೂರ್ಣಗೊಂಡಿವೆ ಎಂದು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ ❗",
    };
  }

  // make query metadata
  const querymeta =
  {
    'name_kn':
    {
      'value': name,
      'op': 'eq'
    }
  }

  console.log(querymeta);


  const pinataQuery = await userPinList(querymeta);
  if (pinataQuery.result) {
    return {
      success: false,
      status: "😢 ಈ ಶೀರ್ಷಿಕೆಯನ್ನು ಈಗಾಗಲೇ ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ !",
    };
  }

  //make metadata
  const metadata = {
    pinataMetadata: {
      name: 'Item',
      keyvalues: {
        name_kn: name,
        name_en: name2
      }
    },
    pinataContent: {
      name: name,
      image: url,
      description: description
    }
  }



  const pinataResponse = await pinJSONToIPFS(metadata);
  if (!pinataResponse.success) {
    return {
      success: false,
      status: "😢 ನಿಮ್ಮ ಟೋಕನ್ URI ಅನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡುವಾಗ ಏನೋ ತಪ್ಪಾಗಿದೆ.",
    };
  }

  const tokenURI = pinataResponse.pinataUrl;

  window.contract = await new web3.eth.Contract(contractABI, contractAddress);

  const transactionParameters = {
    to: contractAddress, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    data: window.contract.methods
      .mintNFT(window.ethereum.selectedAddress, tokenURI)
      .encodeABI(),
  };

  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    return {
      success: true,
      status:
        `ನಿಮ್ಮ 
        ಶೀರ್ಷಿಕೆಯನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ ✅ 
        ವಹಿವಾಟನ್ನು ಪರಿಶೀಲಿಸಿ Etherscan: https://ropsten.etherscan.io/tx/` +
        txHash,
    };
  } catch (error) {
    return {
      success: false,
      status: "😥 ಏನೋ ತಪ್ಪಾಗಿದೆ: " + error.message,
    };
  }

};
