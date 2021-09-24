import StepView from "./StepView"
import "./StepContainer.css"
import { useState } from "react"

function StepContainer({steps}) {
  const [expandedIndex, setExpandedIndex] = useState(null)

  return <div className="step-container">{steps.map((step, i) => 
    <StepView 
      key={i} 
      index={i}
      step={step} 
      canExpand={i === 0 ? true : steps[i-1].done}
      isExpanded={expandedIndex === i}
      setExpanded={setExpandedIndex}
    />)} 
  </div> 
}

export default StepContainer