import './App.css';
import { BrowserProvider, ethers, Contract } from "ethers";
import { useState } from "react";
import AddressContract from "./contract/address.json"
import HighLow from "./contract/HighLow.json"

function App() {
  const [address, setAddress] = useState("");
  const [chainId, setChainId] = useState(undefined);
  const [balance, setBalance] = useState("");
  const [contract, setContract] = useState(undefined);
  const [deposit, setDeposit] = useState("");
  const [numberInput, setNumberInput] = useState(0);
  const [betMoney, setbetMoney] = useState(0);


  const depositf = async () => {
    await contract.deposit({ value: ethers.parseEther(deposit.toString()) });
  }

  const highLow = async () => {
    await contract.highLow(numberInput, ethers.parseEther(betMoney.toString()));
  }

  const connectWallet = async () => {
    if (window.ethereum === undefined) {
      alert("Please connect to MetaMask.")
      return;
    }

    const provider = new BrowserProvider(window.ethereum); // provider for the wallet
    const signer = await provider.getSigner(); // signer for the wallet

    const _address = await signer.getAddress(); // get the address of the wallet

    const _chainId = await provider.getNetwork(); // get the chainId of the wallet


    const _balance = await provider.getBalance(_address); // get the balance of the wallet

    setAddress(_address);
    setChainId(_chainId.chainId);
    setBalance(ethers.formatEther(_balance));

    // connect to the contract
    const contractAddress = new Contract(AddressContract.address, HighLow.abi, signer); // 3 parameters are required: address, abi, signer
    setContract(contractAddress);

    contractAddress.on("Result", (isWon, winner) => {
      alert(`You ${isWon ? "won" : "lost"}! ${isWon ? "Winner: " + winner : ""}.`);
      setBalance(ethers.formatEther(_balance));
    }
    )

    // call the contract
    // only read-only variables (pure, view) are returned data (through clg)  
    // let result = await contractAddress.owner();
    // console.log(result);

    const balance = await contractAddress.accounts(_address);
    setBalance(ethers.formatEther(balance));


  }


  return (
    <div className="App">
      <header className="App-header">
        <p><code>Connect to Metamask wallet</code></p>
        <p style={{ display: address ? "block" : "none" }}><code>Address: {address && address}</code></p>

        <p style={{ display: chainId ? "block" : "none" }}><code>ChainId: {chainId && chainId.toString()}</code></p>

        <p style={{ display: balance ? "block" : "none" }}><code>Balance: {balance && balance} eth</code></p>

        <div style={
          {
            display: contract ? "block" : "none"
          }
        } >
          <input onChange={(e) => setDeposit(e.target.value)} type="number" placeholder='deposit' />
          <button
            onClick={() => depositf()}>Deposit</button>
        </div>
        <div style={
          {
            display: contract ? "block" : "none"
          }
        }>
          <input onChange={(e) => setNumberInput(e.target.value)} type="number" placeholder='Lucky number' />
          <input onChange={(e) => setbetMoney(e.target.value)} type="number" placeholder='amount' />
          <button
            onClick={() => highLow()}>Play</button>
        </div>

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
              fontSize: '24px',
              width: '200px',
              display: contract ? "none" : "block"
            }

          }>Connect </button>

      </header>
    </div>
  );
}

export default App;
