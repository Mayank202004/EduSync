// components/ScreenShareTile.jsx
const ScreenShareTile = ({ participant }) => {
  return (
    <div className="relative col-span-full row-span-2 bg-black rounded-xl overflow-hidden">
      <video
        ref={participant.screenRef}
        autoPlay
        playsInline
        className="w-full h-full object-contain"
      />
      <div className="absolute top-2 left-2 bg-red-600 text-white px-3 py-1 text-sm rounded-lg">
        Screen Sharing – {participant.name}
      </div>
    </div>
  );
};

export default ScreenShareTile;
