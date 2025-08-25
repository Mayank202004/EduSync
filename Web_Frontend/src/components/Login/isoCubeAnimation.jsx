import { useRive, useStateMachineInput } from "@rive-app/react-canvas";
import animationFile from "../../assets/isoCube.riv";

const IsoCubeAnimation = (autoplay = true) => {
  const STATE_MACHINE_NAME = "State Machine 1";
  const HOVER_INPUT_NAME = "Hovered";

  const { RiveComponent, rive } = useRive({
    src: animationFile,
    artboard: "Artboard",
    stateMachines: [STATE_MACHINE_NAME],
    autoplay: autoplay,
    fit: "cover", // Rive may ignore, but fine
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
      className="relative w-full h-screen overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Mobile (zoom in both directions), Large screens (stretch horizontal only) */}
      <div
        className={`
          absolute top-1/2 left-1/2 
          w-[200vw] h-[200vh] 
          sm:w-[120vw] sm:h-screen 
          -translate-x-1/2 -translate-y-1/2
        `}
      >
        <RiveComponent className="w-full h-full" />
      </div>
    </div>
  );
};

export default IsoCubeAnimation;
