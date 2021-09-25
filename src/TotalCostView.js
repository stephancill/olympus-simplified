import { useEffect, useState } from "react"
import { formatUnits } from "@ethersproject/units"
import { BigNumber } from "@ethersproject/bignumber"
import { ChainId, Token, WETH, Fetcher, Route } from "@sushiswap-core/sdk";

function TotalCostView({provider}) {
  const [gasPrice, setGasPrice] = useState(undefined)
  const [listening, setListening] = useState(false)
  const [ethPrice, setEthPrice] = useState(undefined)

  useEffect(() => {
    (async function () {
      if (!listening) {
        const _gasPrice = await provider.getGasPrice()
        setGasPrice(BigNumber.from(_gasPrice))
        provider.on("block", async (blockNumber) => {
          const _gasPrice = await provider.getGasPrice()
          setGasPrice(_gasPrice)
        })
        setListening(true)
      }
    })()
    
  }, [listening])

  useEffect(() => {
    if (!ethPrice)
    (async () => {
      const DAI = new Token(ChainId.MAINNET,  "0x6B175474E89094C44Da98b954EedeAC495271d0F",  18)
      const pair = await Fetcher.fetchPairData(DAI, WETH[DAI.chainId])
      const route = new Route([pair], WETH[DAI.chainId])
      setEthPrice(parseInt(route.midPrice.toSignificant(6)))
    })()
    
  }, [gasPrice])

  if (gasPrice && ethPrice) {
    const ethCost = gasPrice.mul(287056)
    const usdCost = parseFloat(formatUnits(ethCost, "ether"))*ethPrice
    return <div className="subtitle">Total cost to Ape: {formatUnits(ethCost, "ether")}Ξ (${usdCost}) @ {formatUnits(gasPrice, "gwei")} gwei</div> 
  } else {
    return <></>
  }
}

export default TotalCostView