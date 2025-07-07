import LinkButton from "@/components/Chat/LinkButton";
import unauthorizedImg from "@/assets/unauthorized_illustration.png";

const Unauthorized401 = () => {
  return (
    <div className=" flex min-h-full grow flex-col items-center justify-center">
      <img
        src={unauthorizedImg}
        className="max-w-full max-h-7/10 object-contain"
        alt="Unauthorized image"
      />
      <span className="text-lg">You are not authorized to access this page.</span>
      <LinkButton to="/" className="text-sm" navigateProps={{ replace: true }}>
        Go back to homepage
      </LinkButton>
    </div>
  );
};

export default Unauthorized401;
