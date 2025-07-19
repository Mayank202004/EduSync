// components/Avatar.jsx
const Avatar = ({ name, avatar, size=16 }) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={`w-${size} h-${size} rounded-full overflow-hidden bg-gradient-to-tr from-pink-500 to-violet-600 flex items-center justify-center text-white text-xl font-bold`}>
      {avatar ? (
        <img
          src={avatar}
          alt={name}
          className="w-full h-full object-cover"
        />
      ) : (
        initials
      )}
    </div>
  );
};

export default Avatar;
