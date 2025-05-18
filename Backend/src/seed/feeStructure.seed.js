import { FeeStructure } from "../models/feeStructure.model.js";

const classes = ["1", "2", "3", "4", "5", "6"];
const feeTypes = ["Tuition Fee", "Transport Fee", "Other Fee"];

const terms = {
  "Tuition Fee": [
    { title: "Full Year Fees with Discount", amount: 40000, dueDate: "2025-06-01" },
    { title: "Term 1", amount: 15000, dueDate: "2025-06-01" },
    { title: "Term 2", amount: 14000, dueDate: "2025-09-01" },
    { title: "Term 3", amount: 14000, dueDate: "2025-12-01" }
  ],
  "Transport Fee": [
    { title: "Term 1", amount: 12000, dueDate: "2025-06-01" },
    { title: "Term 2", amount: 13000, dueDate: "2025-09-01" }
  ],
  "Other Fee": [
    { title: "Diary", amount: 200 } 
  ]
};

export const seedDefaultFeeStructures = async () => {
  const count = await FeeStructure.estimatedDocumentCount();
  if (count > 0) {
    return;
  }

  for (const className of classes) {
    const feeList = feeTypes.map(feeType => ({
      feeType,
      structure: (terms[feeType] || []).map(term => ({
        ...term,
        compulsory: feeType === "Tuition Fee", // only tuition is compulsory
        discount: 0
      }))
    }));

    const feeStructure = new FeeStructure({
      class: className,
      fee: feeList
    });

    await feeStructure.save();
  }
};
