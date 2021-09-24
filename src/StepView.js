import "./StepView.css"

function StepView({index, step, canExpand, isExpanded, setExpanded}) {
  const {title, done, content} = step
  return <div className="step-view">
    <div className="title">
      <span style={{marginRight: "auto"}}>{done ? "✅" : ""} {index+1}. {title}</span>
      <button disabled={!canExpand} onClick={() => isExpanded ? setExpanded(null) : setExpanded(index)}>Expand</button>
    </div> 
    {isExpanded ? <div className="body">{content()}</div> : <></>}
  
  </div>
}

export default StepView