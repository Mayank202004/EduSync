import notFoundImage from "@/assets/404.png";
import LinkButton from "@/components/Chat/LinkButton";

const NotFound404 = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold">Error 404</h1>
      <p className="text-gray-500 text-lg">Resource not found</p>
      <img
        src={notFoundImage}
        className="max-w-full max-h-1/2 object-contain"
        alt="Resource not found image"
      />
      <LinkButton to={-1} className="text-sm" navigateProps={{ replace: true }}>
        Go back
      </LinkButton>
    </div>
  );
};

export default NotFound404;
