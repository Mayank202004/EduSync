import {
  Monitor,
  Mic,
  Video,
  MessageSquareText,
  Lock,
  Unlock,
} from "lucide-react";
import Switch from "@/components/UI/Switch";
import OptionSelection from "@/components/UI/OptionSelection";

const HostControlPanel = ({ controls, setControls }) => {
  const toggle = (key) =>
    setControls((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="px-4 py-2 space-y-6">
      <p className="text-xs text-gray-500">Use these host controls to manage the meeting. Only hosts can use these controls</p>

      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-gray-700">Meeting Moderation</h2>

        <p className="text-xs text-gray-500">Allow participants to</p>

        <ToggleItem
          label="Allow screen sharing"
          icon={<Monitor size={16} />}
          value={controls.screenShare}
          onChange={() => toggle("screenShare")}
        />
        <ToggleItem
          label="Allow microphone usage"
          icon={<Mic size={16} />}
          value={controls.microphone}
          onChange={() => toggle("microphone")}
        />
        <ToggleItem
          label="Allow video usage"
          icon={<Video size={16} />}
          value={controls.video}
          onChange={() => toggle("video")}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-gray-700">Chat Moderation</h2>

        <ToggleItem
          label="Allow participants to send messages"
          icon={<MessageSquareText size={16} />}
          value={controls.chat}
          onChange={() => toggle("chat")}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-gray-700">Meeting Access</h2>

        <div className="space-y-2">
          <OptionSelection
            label="Open to join"
            value="open"
            selected={controls.access === "open"}
            icon={<Unlock size={16} />}
            onSelect={() => setControls((prev) => ({ ...prev, access: "open" }))}
          />
          <OptionSelection
            label="Trusted only (Request to join)"
            value="trusted"
            selected={controls.access === "trusted"}
            icon={<Lock size={16} />}
            onSelect={() => setControls((prev) => ({ ...prev, access: "trusted" }))}
          />
        </div>
      </div>
    </div>
  );
};

const ToggleItem = ({ label, icon, value, onChange }) => (
  <label className="flex items-center justify-between py-2 cursor-pointer">
    <span className="flex items-center gap-2 text-sm text-gray-700">
      {icon}
      {label}
    </span>
    <Switch checked={value} onChange={onChange} />
  </label>
);



export default HostControlPanel;
