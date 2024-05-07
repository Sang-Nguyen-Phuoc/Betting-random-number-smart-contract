import './App.css';
import { BrowserProvider, ethers } from "ethers";
import { useState } from "react";

function App() {
  const [address, setAddress] = useState("");
  const [chainId, setChainId] = useState(undefined);
  const [balance, setBalance] = useState("");
  const connectWallet = async () => {
    if (window.ethereum === undefined) {
      alert("Please connect to MetaMask.")
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum); // provider for the wallet
    const signer = await provider.getSigner(); // signer for the wallet

    const _address = await signer.getAddress(); // get the address of the wallet

    const _chainId = await provider.getNetwork(); // get the chainId of the wallet
    console.log(_chainId.chainId)


    const _balance = await provider.getBalance(_address); // get the balance of the wallet

    setAddress(_address);
    setChainId(_chainId.chainId);
    setBalance(ethers.formatEther(_balance));
  }
  return (
    <div className="App">
      <header className="App-header">
        <p><code>Connect to Metamask wallet</code></p>
        <p style={{ display: address ? "block" : "none" }}><code>Address: {address && address}</code></p>

        <p style={{ display: chainId ? "block" : "none" }}><code>ChainId: {chainId && chainId.toString()}</code></p>

        <p style={{ display: balance ? "block" : "none" }}><code>Balance: {balance && balance} eth</code></p>
        <button
          onClick={() => connectWallet()}
          style={
            {
              padding: '20px 30px',
              margin: '10px',
              backgroundColor: 'blue',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '24px'
            }

          }>Connect</button>

      </header>
    </div>
  );
}

export default App;
