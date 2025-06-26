//Scrollspy specific stuff taken from: https://blog.maximeheckel.com/posts/scrollspy-demystified/

import { useEffect, useRef, useState } from "react";

import { useAuth } from "@/context/AuthContext";

import AvatarIcon from "@/components/ui/AvatarIcon";
import EditAccountDetails from "@/components/EditUserProfile/EditAccountDetails";
import PhotoPreview from "@/components/EditUserProfile/PhotoPreview";
import TitledContainer from "@/components/ui/TitledContainer";
import ScrollSpy from "@/components/EditUserProfile/ScrollSpy";

import { capitalizeFirstLetter } from "@/utils/textUtils";

const OFFSET = 40;
const SECTIONS = [
  { id: "photo-preview", title: "Photo Preview" },
  { id: "account-details", title: "Account Details" },
];

const titledContainerStyle = "px-4 py-6 sm:px-10";

const TeacherProfileSection = () => {
  const { user } = useAuth();
  const rootRef = useRef();

  const [elements, setElements] = useState();

  useEffect(() => {
    const elementsObjects = SECTIONS.map(({ id }) =>
      document.body.querySelector(`#${id}-section`)
    );
    setElements(elementsObjects);
  }, []);

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
        <ScrollSpy
          elements={elements}
          rootRef={rootRef}
          titleElementMap={SECTIONS}
          offset={OFFSET}
        />
        <div className="min-w-2xs max-w-4xl w-full flex flex-col gap-6 items-center rounded-md mx-auto mb-[50vh]">
          <TitledContainer
            id="photo-preview-section"
            title="Photo Preview"
            containerStyle={titledContainerStyle + "px-2 sm:px-6"}
          >
            <PhotoPreview avatar={user.avatar} />
          </TitledContainer>
          <TitledContainer
            id="account-details-section"
            title="Account details"
            containerStyle={titledContainerStyle}
          >
            <EditAccountDetails
              accountInfo={{
                fullName: user.fullName,
                username: user.username,
              }}
            />
          </TitledContainer>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfileSection;
