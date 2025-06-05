//Scrollspy specific stuff taken from: https://blog.maximeheckel.com/posts/scrollspy-demystified/

import { useEffect, useRef, useState } from "react";

import { useAuth } from "@/auth/AuthContext";

import SiblingsInfo from "@/components/UserProfile/SiblingsInfo";
import AvatarIcon from "@/components/Topbar/AvatarIcon";
import EditAccountDetails from "@/components/UserProfile/EditAccountDetails";
import PhotoPreview from "@/components/UserProfile/PhotoPreview";
import TitledContainer from "@/components/ui/TitledContainer";
import ScrollSpy from "@/components/UserProfile/ScrollSpy";
import ParentsInfo from "@/components/UserProfile/ParentsInfo";
import ParentsContact from "@/components/UserProfile/ParentsContact";
import { capitalizeFirstLetter } from "@/lib/utils";

import { getStudentInfo } from "@/services/studentInfoService";

const OFFSET = 40;
const SECTIONS = [
  { id: "photo-preview", title: "Photo Preview" },
  { id: "account-details", title: "Account Details" },
  { id: "siblings-info", title: "Siblings Info" },
  { id: "parents-info", title: "Parents Info" },
  { id: "parents-contact", title: "Parents Contact" },
];

const StudentProfileSection = () => {
  const { user } = useAuth();
  const rootRef = useRef();
  const [info, setInfo] = useState([]);

  const [elements, setElements] = useState();

  useEffect(() => {
    const elementsObjects = SECTIONS.map(({ id }) =>
      document.body.querySelector(`#${id}-section`)
    );
    setElements(elementsObjects);

    (async () => {
      const response = await getStudentInfo();
      setInfo(response.data);
      console.log(response.data);
    })();
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
          <TitledContainer id="siblings-info-section" title="Siblings Info">
            <SiblingsInfo key={info} initialInfo={info.siblingInfo} />
          </TitledContainer>
          <TitledContainer id="parents-info-section" title="Parents Info">
            <ParentsInfo key={info} initialInfo={info.parentsInfo} />
          </TitledContainer>
          <TitledContainer id="parents-contact-section" title="Parents Contact">
            <ParentsContact key={info} initialInfo={info.parentContact} />
          </TitledContainer>
        </div>
      </div>
    </div>
  );
};

export default StudentProfileSection;
