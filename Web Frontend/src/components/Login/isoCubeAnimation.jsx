import { useRive, useStateMachineInput } from "@rive-app/react-canvas";
import { useEffect } from "react";
import animationFile from "../../assets/isoCube.riv";

const IsoCubeAnimation = () => {
  const STATE_MACHINE_NAME = "State Machine 1";
  const HOVER_INPUT_NAME = "Hovered"; 

  const { RiveComponent, rive } = useRive({
    src: animationFile,
    artboard: "Artboard",
    stateMachines: [STATE_MACHINE_NAME],
    autoplay: true,
  });

  const hoverInput = useStateMachineInput(rive, STATE_MACHINE_NAME, HOVER_INPUT_NAME);

  const handleMouseEnter = () => {
    if (hoverInput) hoverInput.value = true;
  };

  const handleMouseLeave = () => {
    if (hoverInput) hoverInput.value = false;
  };

  return (
    <div
      className="w-lvw h-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <RiveComponent />
    </div>
  );
};

export default IsoCubeAnimation;
