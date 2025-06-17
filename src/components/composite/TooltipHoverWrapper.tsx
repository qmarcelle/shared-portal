import { ReactNode, useState } from "react";
import { IComponent } from "../IComponent";
import { ToolTip } from "../foundation/Tooltip";

interface TooltipHoverWrapperProps extends IComponent {
  children: JSX.Element,
  label: ReactNode,
}

export const TooltipHoverWrapper = ({children, label}: TooltipHoverWrapperProps) => {
  const [showTooltip, setShowToolTip] = useState(false);
  return (
    <>
      <div onMouseEnter={() => setShowToolTip(true)} onMouseLeave={() => setShowToolTip(false)}>
        {children}
      </div>
      <ToolTip showTooltip={showTooltip} label={label}></ToolTip>
    </>
  )
}