import { useState } from "react";
import PaymentFAQs from "@/components/Fees/FAQs";
import RaiseTicket from "@/components/Fees/RaiseTicket";
import PendingFees from "@/components/Fees/PendingFees";
import PaidFees from "@/components/Fees/PaidFees";

const { data: allFeesData } = JSON.parse(`{
    "statusCode": 200,
    "data": {
        "paid": {
            "academic": [
                {
                    "structureId": "68299233501c1a93bc381813",
                    "title": "Full Year Fees with Discount",
                    "amount": 40000,
                    "paidOn": "2025-05-18T17:51:03.505Z",
                    "transactionId": "abcd1234",
                    "mode": "Online"
                }
            ],
            "transport": [],
            "other": [
                {
                    "structureId": "68299233501c1a93bc381810",
                    "title": "Diary",
                    "amount": 200,
                    "paidOn": "2025-05-18T16:55:40.526Z",
                    "transactionId": "abcd1234",
                    "mode": "Online"
                }
            ]
        },
        "pending": {
            "academic": [],
            "transport": [
                {
                    "_id": "68299233501c1a93bc381808",
                    "title": "Term 1",
                    "dueDate": "2025-06-01T00:00:00.000Z",
                    "amount": 12000,
                    "discount": 0,
                    "compulsory": false
                },
                {
                    "_id": "68299233501c1a93bc381809",
                    "title": "Term 2",
                    "dueDate": "2025-09-01T00:00:00.000Z",
                    "amount": 13000,
                    "discount": 0,
                    "compulsory": false
                }
            ],
            "other": []
        }
    },
    "message": "Fee status fetched successfully",
    "success": true
}`);

const Fees = () => {
  const [feesData, setFeesData] = useState(allFeesData);

  const isPending = Object.values(feesData.pending).some(
    (value) => value.length !== 0
  );

  const isPaid = Object.values(feesData.paid).some(
    (value) => value.length !== 0
  );

  return (
    <>
      <div className="md:flex min-h-screen">
        <div className="md:w-3/10 md:border-r-1 md:min-h-screen">
          <h1 className="font-bold text-3xl mt-4 w-fit mx-auto md:mt-10 md:mb-2">
            Fees
          </h1>
          <p className="w-fit mx-auto text-center text-lg text-gray-500">
            Academic year: 2025-26
          </p>
        </div>
        <div className="p-4 md:mr-0 w-full">
          <PendingFees isPending={isPending} feesData={feesData.pending} />
          <hr className="mt-6" />
          <PaidFees isPaid={isPaid} feesData={feesData.paid} />
        </div>
        <hr className="md:hidden" />
        <div className="md:w-1/2 border-l-1 md:min-h-screen">
          <PaymentFAQs />
          <RaiseTicket />
        </div>
      </div>
    </>
  );
};

export default Fees;
