//Scrollspy specific stuff taken from: https://blog.maximeheckel.com/posts/scrollspy-demystified/

import { useEffect, useRef, useState } from "react";

import { useAuth } from "@/auth/AuthContext";
import useScrollspy from "@/hooks/useScrollSpy";

import AvatarIcon from "@/components/Topbar/AvatarIcon";
import EditAccountDetails from "@/components/UserProfile/EditAccountDetails";
import PhotoPreview from "@/components/UserProfile/PhotoPreview";
import TitledContainer from "@/components/ui/TitledContainer";

import { capitalizeFirstLetter } from "@/lib/utils";
import { cn } from "@/lib/utils";

const OFFSET = 0;
const SECTIONS = [
  { id: "photo-preview", title: "Photo Preview" },
  { id: "account-details", title: "Account Details" },
];

const UserProfile = () => {
  const rootRef = useRef();

  const [elements, setElements] = useState();
  const [activeIndex] = useScrollspy(elements, {
    root: rootRef,
    offset: OFFSET,
  });

  const { user } = useAuth();

  useEffect(() => {
    const elementsObjects = SECTIONS.map(({ id }) =>
      document.body.querySelector(`#${id}-section`)
    );
    setElements(elementsObjects);
  }, []);

  const handleLinkClick = (event, id) => {
    event.preventDefault();

    const element = document.getElementById(id);
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = element.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - OFFSET;

    /**
     * Note @MaximeHeckel: This doesn't work on Safari :(
     * TODO: find an alternative for Safari
     */
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  };

  return (
    <div
      ref={rootRef}
      className="flex flex-col min-h-full w-fit mx-auto bg-customLightBg dark:bg-customDarkBg"
    >
      <h1 className="font-bold text-4xl w-fit mx-auto mt-10">Edit Profile</h1>
      <h3 className="mx-auto text-lg text-gray-400">
        {capitalizeFirstLetter(user.role)}
      </h3>
      <div className="relative w-full h-full flex flex-col tablet:flex-row mx-auto my-6">
        <div className="tablet:sticky tablet:self-start tablet:left-10 tablet:top-0 tablet:bottom-0 tablet:right-2 flex order-first tablet:mx-0 my-2 flex-col h-fit gap-3 p-4 tablet:p-2 max-w-xs tablet:max-w-56 w-full">
          <h1 className="font-bold text-gray-400 tracking-widest">Jump to</h1>
          <ul className="border-s-1 space-y-2.5 text-sm">
            {SECTIONS.map(({ id, title }, index) => {
              return (
                <li
                  key={index}
                  className={cn(
                    "flex flex-col px-3 opacity-50 border-s-3 border-gray-300 transition-all duration-200",
                    index !== activeIndex && "not-hover:border-transparent",
                    index === activeIndex &&
                      "text-blue-400 opacity-100 border-blue-400 text-wrap"
                  )}
                >
                  <a
                    key={id}
                    href={`#${id}-section`}
                    onClick={(event) => handleLinkClick(event, `${id}-section`)}
                  >
                    {title}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="min-w-2xs max-w-3xl w-full flex flex-col gap-6 items-center rounded-md mx-auto mb-[50vh]">
          <TitledContainer
            id="photo-preview-section"
            title="Photo Preview"
            containerStyle="px-2 sm:px-6"
          >
            <PhotoPreview avatar={user.avatar} />
          </TitledContainer>
          <TitledContainer id="account-details-section" title="Account details">
            <EditAccountDetails
              accountInfo={{
                fullName: user.fullName,
                username: user.username,
              }}
            />
          </TitledContainer>
        </div>
        {/**self-start required to make sticky work, also dont add any overflow property on parent elements */}
      </div>
    </div>
  );
};

export default UserProfile;
