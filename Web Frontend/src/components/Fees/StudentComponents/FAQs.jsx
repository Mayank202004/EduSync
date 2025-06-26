import { useEffect, useState } from "react";

import ExpandableItem from "@/components/Home/Sidebar/ExpandableItem";
import { getAllFaqs } from "@/services/faqsService";

const PaymentFAQs = () => {
  const [faqs, setFAQs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await getAllFaqs();
        console.log(response);
        setFAQs(response.data);
      } catch (_) {
        //handle later
      } finally {
        setIsLoading(false);
      }
    };
    fetchFaqs();
  }, []);
  return (
    <div className="w-[80%] mx-auto bg-white mt-10 mb-6 py-2 px-4 rounded-sm dark:bg-customDarkFg">
      <h2 className="text-lg font-bold">Payment FAQs</h2>
      <hr className="my-2" />
      <div className="flex flex-col gap-2">
        {faqs.map(({ question, answer, _id }) => (
          <ExpandableItem key={_id} title={question}>
            <p>{answer}</p>
          </ExpandableItem>
        ))}
      </div>
    </div>
  );
};

export default PaymentFAQs;
