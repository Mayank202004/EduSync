import { FeeStructure } from "../models/feeStructure.model.js";
import { FeeItem } from "../models/feeStructure.model.js";

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

  // Step 1: Create shared FeeItems for Transport and Other only once
  const sharedFeeItemsMap = {}; // { feeType: [FeeItem _ids] }

  for (const feeType of ["Transport Fee", "Other Fee"]) {
    const termItems = terms[feeType] || [];
    const feeItemDocs = await Promise.all(termItems.map(term => {
      const feeItem = new FeeItem({
        title: term.title,
        dueDate: term.dueDate,
        compulsory: false,  // transport and other are not compulsory as per your logic
        amount: term.amount,
        discount: 0
      });
      return feeItem.save();
    }));
    sharedFeeItemsMap[feeType] = feeItemDocs.map(doc => doc._id);
  }

  // Step 2: For each class, create Tuition Fee items separately + use shared for transport and other
  for (const className of classes) {
    const feeList = [];

    for (const feeType of feeTypes) {
      if (feeType === "Tuition Fee") {
        // Create Tuition Fee items for each class separately
        const termItems = terms[feeType] || [];
        const feeItemDocs = await Promise.all(termItems.map(term => {
          const feeItem = new FeeItem({
            title: term.title,
            dueDate: term.dueDate,
            compulsory: true,
            amount: term.amount,
            discount: 0
          });
          return feeItem.save();
        }));

        feeList.push({
          feeType,
          structure: feeItemDocs.map(doc => doc._id)
        });
      } else {
        // For Transport and Other use shared feeItems
        feeList.push({
          feeType,
          structure: sharedFeeItemsMap[feeType] || []
        });
      }
    }

    const feeStructure = new FeeStructure({
      class: className,
      fee: feeList
    });

    await feeStructure.save();
  }
};
