import { formatUnits, parseEther } from "@ethersproject/units";
import {  ChainId,  Token,  WETH,  Fetcher,  Trade,  Route,  TokenAmount,  TradeType, Percent} from "@sushiswap-core/sdk"
import { useEffect, useState } from "react";
import Arrow from "./Arrow.svg"
import "./EthSwap.css"

const OHM = new Token(ChainId.MAINNET,  process.env.REACT_APP_OHM_CONTRACT,  9);
const DAI = new Token(  ChainId.MAINNET,  "0x6B175474E89094C44Da98b954EedeAC495271d0F",  18);

function EthSwap({signer}) {
  const [ethAmount, setEthAmount] = useState(0)
  const [ohmAmount, setOhmAmount] = useState(0)
  const [trade, setTrade] = useState(undefined)

  useEffect(() => {
    if (ethAmount > 0) {
      (async () => {
        const ethPair = await Fetcher.fetchPairData(DAI, WETH[OHM.chainId], signer);
        const daiPair = await Fetcher.fetchPairData(OHM, DAI, signer);
        const route = new Route([ethPair, daiPair], WETH[OHM.chainId]);
        const amountIn = parseEther(ethAmount.toString()); // 1 WETH
        const trade = new Trade(route, new TokenAmount(WETH[OHM.chainId], amountIn), TradeType.EXACT_INPUT);
        setTrade(trade)
        trade.outputAmount.toSignificant(6)
        console.log(trade.executionPrice.invert().toSignificant(6))
      })()
    }
  }, [ethAmount])

  return <div style={{display: "flex", flexDirection: "column", alignItems: "start"}}>
    <div className="swap-row">
      <span style={{flexGrow: 1}}>You pay</span>
      <input style={{width: "40px"}} disabled={true} type="text" value={"ETH"}/>
      <input type="number" onChange={(e) => setEthAmount(e.target.value)} step={Math.pow(10, -9)} value={ethAmount}/>
    </div>
    <div style={{width: "100%"}} >
    <img src={Arrow}></img>
    </div>
    
    <div className="swap-row">
      <span style={{flexGrow: 1}}>You get</span>
      <input style={{width: "40px"}} disabled={true} type="text" value={"OHM"}/>
      <input disabled={true} type="number" value={trade ? trade.outputAmount.toSignificant(6) : 0}/>
    </div>
    {/* TODO: Trade */}
    <button onClick={() => console.log("trade")} style={{width: "100%"}}>Confirm Swap</button>
  </div>
}

export default EthSwap