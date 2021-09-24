import { useEffect, useState } from "react"
import { formatUnits } from "@ethersproject/units"
import { BigNumber } from "@ethersproject/bignumber"

function TotalCostView({provider}) {
  const [gasPrice, setGasPrice] = useState(undefined)
  const [listening, setListening] = useState(false)

  useEffect(() => {
    (async function () {
      console.log("enter")
      if (!listening) {
        const _gasPrice = await provider.getGasPrice()
        console.log(_gasPrice)
        setGasPrice(BigNumber.from(_gasPrice))
        provider.on("block", async (blockNumber) => {
          console.log(blockNumber)
          const _gasPrice = await provider.getGasPrice()
          console.log(_gasPrice)
          setGasPrice(_gasPrice)
        })
        setListening(true)
      }
    })()
    
  }, [listening])

  // TODO: Rounding (6 decimals)
  return gasPrice !== undefined ? <div className="subtitle">Total cost to Ape: {formatUnits(gasPrice.mul(287056), "ether")}Ξ @ {formatUnits(gasPrice, "gwei")} gwei</div> : <></>
}

export default TotalCostView