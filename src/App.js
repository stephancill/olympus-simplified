import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import StepContainer from "./StepContainer"
import TotalCostView from './TotalCostView';
import "./App.css"
require('dotenv').config({path: "./../.env"})

async function getOHMBalance({signer}) {

}

async function connectWallet({setProvider}) {
  const web3Modal = new Web3Modal({
    providerOptions: {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: process.env.REACT_APP_INFURA_ID
        }
      }
    }
  })

  let provider = await web3Modal.connect()
  if (!provider) {
    return
  }

  provider = new ethers.providers.Web3Provider(provider)
  setProvider(provider)
}

function App() {

  const [signer, setSigner] = useState(undefined)
  const [currentUser, setCurrentUser] = useState(undefined)
  const [userEthBalance, setUserEthBalance] = useState(0)
  const [provider, setProvider] = useState(undefined)
  const [steps, setSteps] = useState([])

  useEffect(() => {
    async function getAddress() {
      const address = await signer.getAddress()
      const ethBalance = await signer.getBalance()
      setCurrentUser(address)
      setUserEthBalance(ethBalance)
    }
    if (signer) {
      getAddress()
    }
  }, [signer])

  function reset() {
    setProvider(undefined)
    setSigner(undefined)
    setCurrentUser(undefined)
    setUserEthBalance(0)
  }

  useEffect(() => {
    if (provider) {
      if (window.ethereum) {
        window.ethereum.on("accountsChanged", ([newAddress]) => {
          if (newAddress === undefined) {
            reset()
          } else {
            const signer = provider.getSigner()
            setSigner(signer)
          }
        })
      }
      const signer = provider.getSigner()
      setSigner(signer)
    }
  }, [provider])

  useEffect(() => {
    setSteps([
      {title: "Connect Wallet", done: currentUser != null, content: function() {
        return signer ? <div>Connected {currentUser}</div> : <button onClick={() => connectWallet({setProvider})}>Connect</button> 
      }},
      {title: "Buy ETH", done: userEthBalance > 0 , content: function() {
        return userEthBalance > 0 ? <div>ETH balance: {ethers.utils.formatUnits(userEthBalance)}</div> : <button >Buy ETH</button> 
      }},
  
      {title: "Buy OHM", done: false, content: function() {
        return <div>
          <div>Buy $OHM</div>
          <div>
            <span>You pay</span>
            <input type="text" value={"ETH"}/>
            <input type="number" step={Math.pow(10, -9)} value={"0.1"}/>
          </div>
          <div>
            <span>You receive</span>
            <input disabled={true} type="text" value={"OHM"}/>
            <input disabled={true} type="number" value={"0.1"}/>
          </div>
          <button>Confirm Swap</button>
        </div>
      }},
      {title: "Stake OHM", done: false, content: function() {
        return <div>Stake</div>
      }},
    ])
  }, [signer, currentUser, userEthBalance])

  return (
    <div className="App">
      <section style={{marginBottom: "50px"}}>
        <div className="hero">Olympus 🦍</div>
        <div className="subtitle">A step by step guide to buying and staking OHM</div>
      </section>
      
      {provider ? <TotalCostView provider={provider}/> : <></>}

      <StepContainer steps={steps}/>

      {/* TODO: Footer */}
    </div>
  );
}

export default App;
