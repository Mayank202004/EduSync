import { useEffect, useState } from "react";

import ExpandableItem from "@/components/ui/ExpandableItem";
import TitledContainer from "@/components/ui/TitledContainer";

import { getAllFaqs } from "@/services/faqsService";

const PaymentFAQs = () => {
  const [faqs, setFAQs] = useState([]);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await getAllFaqs();
        setFAQs(response.data);
      } catch (_) {
        //handle later
      }
    };
    fetchFaqs();
  }, []);

  return (
    <TitledContainer
      title="FAQs"
      containerStyle="w-[80%] mx-auto mt-10 mb-6 p-4"
      titleStyle="border-b-1"
    >
      <div className="flex flex-col gap-1.5">
        {faqs.map(({ question, answer, _id }, index, array) => (
          <>
            <ExpandableItem
              key={_id}
              title={question}
              childrenContainerStyle="pl-2 border-l-1"
            >
              <p>{answer}</p>
            </ExpandableItem>
            {index !== array.length - 1 && <hr />}
          </>
        ))}
      </div>
    </TitledContainer>
  );
};

export default PaymentFAQs;
