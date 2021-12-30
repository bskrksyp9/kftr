import { useEffect, useState } from "react";
import {
  connectWallet,
  getCurrentWalletConnected,
  mintNFT,
} from "./util/interact.js";

const Minter = (props) => {
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");

  const [name, setName] = useState("");
  const [name2, setName2] = useState("");
  const [description, setDescription] = useState("");
  const [url, setURL] = useState("");

  useEffect(async () => {
    const { address, status } = await getCurrentWalletConnected();

    setWallet(address);
    setStatus(status);

    addWalletListener();
  }, []);

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("👆🏽 ಮೇಲಿನ ಪಠ್ಯ ಕ್ಷೇತ್ರದಲ್ಲಿ ಸಂದೇಶವನ್ನು ಬರೆಯಿರಿ.");
        } else {
          setWallet("");
          setStatus("🦊 ಮೇಲಿನ ಬಲ ಬಟನ್ ಅನ್ನು ಬಳಸಿಕೊಂಡು ಮೆಟಾಮಾಸ್ಕ್‌ಗೆ ಸಂಪರ್ಕಪಡಿಸಿ.");
        }
      });
    } else {
      setStatus(
        <p>
          {" "}
          🦊{" "}
          <a target="_blank" href={`https://metamask.io/download.html`}>
            ನೀವು ಮೆಟಾಮಾಸ್ಕ್, (ಇಥಿರಿಯಮ್ ವರ್ಚುವಲ್ ವ್ಯಾಲೆಟ್) ಅನ್ನು ಸ್ಥಾಪಿಸಬೇಕು
          </a>
        </p>
      );
    }
  }

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };

  const onMintPressed = async () => {
    const { success, status } = await mintNFT(url, name, name2, description);
    setStatus(status);
    if (success) {
      setName("");
      setName2("");
      setDescription("");
      setURL("");
    }
  };

  return (
    <div className="Minter">
      <button id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          "ಸಂಪರ್ಕಿಸಲಾಗಿದೆ: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
            <span>🦊 ವಾಲೆಟ್ ಅನ್ನು
            ಜೋಡಿಸಿ</span>
          )}
      </button>
      <br></br><br></br><br></br>
      <h1>
        'ಬ್ಲಾಕ್ ಚೈನ್' ಆಧಾರಿತ</h1>
      
      <h2 id="title">
        🎬'ಚಲನಚಿತ್ರ ಶೀರ್ಷಿಕೆ'ಯ ನೊಂದಣಿ</h2>
      <p>
        ನಿಮ್ಮ ಸ್ವತ್ತಿನ ಕೊ೦ಡಿ, ಹೆಸರು ಮತ್ತು ವಿವರಣೆಯನ್ನು ಸೇರಿಸಿ
      </p>
      <form>
        <h2>ಸ್ವತ್ತಿನ ಕೊ೦ಡಿ: </h2>
        <input
          type="text"
          placeholder="
          ಉದಾಹರಣೆಗೆ: https://gateway.pinata.cloud/ipfs/<hash>"
          onChange={(event) => setURL(event.target.value)}
        />
        <h2>ಕನ್ನಡದಲ್ಲಿ ಶೀರ್ಷಿಕೆ: </h2>
        <input
          type="text"
          placeholder="
          ಉದಾಹರಣೆಗೆ: ಪ್ರಚಂಡ ಕುಳ್ಳ"
          onChange={(event) => setName(event.target.value)}
        />
        <h2>ಆಂಗ್ಲದಲ್ಲಿ ಶೀರ್ಷಿಕೆ: </h2>
        <input
          type="text"
          placeholder="For example: Prachanda Kulla"
          onChange={(event) => setName2(event.target.value)}
        />
        <h2>✍️ವಿವರಣೆ: </h2>
        <input
          type="text"
          placeholder="
          ಉದಾಹರಣೆಗೆ: ಈ ಚಿತ್ರವು ಉತ್ತಮವಾಗಿರುತ್ತದೆ, ಏಕೆಂದರೆ ;)"
          onChange={(event) => setDescription(event.target.value)}
        />
      </form>
      <button id="mintButton" onClick={onMintPressed}>
        📃ಮುದ್ರಿಸು
      </button>
      <p id="status" style={{ color: "red" }}>
        {status}
      </p>
    </div>
  );
};

export default Minter;
