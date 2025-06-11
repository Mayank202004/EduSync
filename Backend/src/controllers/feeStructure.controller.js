import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { FeeStructure } from "../models/feeStructure.model.js";
import { FeeItem } from "../models/feeStructure.model.js";
import { ClassStructure } from "../models/classStructure.model.js";

/**
 * @desc Add fee details for a specific class
 * @route POST /api/feeStructure/add
 * @access Private (Super Admin)
 */
const addFeeStructure = asyncHandler(async (req, res) => {
  const {
    className,
    amount,
    feeType,
    dueDate,
    compulsory = true,
    discount = 0,
    title,
    addToAllClasses = false
  } = req.body;

  if (!amount || !feeType?.trim() || !title?.trim()) {
    throw new ApiError(400, "All fields are required");
  }

  if (dueDate && new Date(dueDate) < new Date()) {
    throw new ApiError(400, "Invalid due date");
  }

  let classList = [];

  if (addToAllClasses) {
    const allClasses = await ClassStructure.find({}, "className");
    classList = allClasses.map(c => c.className);
  } else {
    if (!className?.trim()) {
      throw new ApiError(400, "className is required when not adding to all classes");
    }
    classList = [className.trim()];
  }

  for (const currentClass of classList) {
    let feeStructure = await FeeStructure.findOne({ class: currentClass });

    if (!feeStructure) {
      feeStructure = await FeeStructure.create({
        class: currentClass,
        fee: [
          { feeType: "Tuition Fee", structure: [] },
          { feeType: "Transport Fee", structure: [] },
          { feeType: "Other Fee", structure: [] }
        ]
      });
    }

    let feeTypeBlock = feeStructure.fee.find(fee => fee.feeType === feeType.trim());

    if (!feeTypeBlock) {
      throw new ApiError(404, "Fee Type not found");
    }

    let existingItemId = null;
    for (const id of feeTypeBlock.structure) {
      const item = await FeeItem.findById(id);
      if (item?.title === title.trim()) {
        existingItemId = id;
        break;
      }
    }

    if (existingItemId) {
      await FeeItem.findByIdAndUpdate(existingItemId, {
        amount,
        dueDate,
        compulsory,
        discount
      });
    } else {
      const newFeeItem = await FeeItem.create({
        title: title.trim(),
        amount,
        dueDate,
        compulsory,
        discount
      });
      feeTypeBlock.structure.push(newFeeItem._id);
    }

    await feeStructure.save();
  }
  return res.status(200).json(new ApiResponse(200, null, "Fee structure updated successfully"));
});




const setDueDate = asyncHandler(async(req,res)=>{
    const {feeType,title,dueDate}=req.body;

    if(!feeType.trim() || !title.trim() || !dueDate){
        throw new ApiError(400,"All fields are required");
    }
    if(new Date(dueDate) < new Date()){
        throw new ApiError(400,"Invalid due date");
    }
    // Update due date for all classes where feeType and title match
    await FeeStructure.updateMany(
    { 
      "fee.feeType": feeType, 
      "fee.structure.title": title 
    },
    {
      $set: {
        "fee.$[f].structure.$[s].dueDate": new Date(dueDate)
      }
    },
    {
      arrayFilters: [
        { "f.feeType": feeType },
        { "s.title": title }
      ]
    }
  );
  return res.status(200).json(new ApiResponse(200,null,"Due date updated successfully"));
});

/**
 * @desc Delete a fee type element from a specific class or for all classes
 * @route DELETE /api/feeStructure/delete
 * @access Private (Super Admin)
 */
const deleteFeeType = asyncHandler(async (req, res) => {
  const { className, feeType, title } = req.body;

  if (!feeType?.trim() || !title?.trim()) {
    throw new ApiError(400, "All fields are required");
  }

  if (className) {
    // Delete from a specific class
    const feeStructure = await FeeStructure.findOne({ class: className });
    if (!feeStructure) {
      throw new ApiError(404, "Fee structure not found for the class");
    }

    const feeTypeEntry = feeStructure.fee.find(f => f.feeType === feeType);
    if (!feeTypeEntry) {
      throw new ApiError(404, "Fee type not found in the class");
    }

    const originalLength = feeTypeEntry.structure.length;
    feeTypeEntry.structure = feeTypeEntry.structure.filter(item => item.title !== title);

    if (feeTypeEntry.structure.length === originalLength) {
      throw new ApiError(404, "Title not found under the fee type");
    }

    await feeStructure.save();
    return res.status(200).json(new ApiResponse200(null, "Fee structure deleted successfully"));

  } else {
    // Delete from all classes
    const result = await FeeStructure.updateMany(
      { "fee.feeType": feeType, "fee.structure.title": title },
      {
        $pull: {
          "fee.$[f].structure": { title: title }
        }
      },
      {
        arrayFilters: [
          { "f.feeType": feeType }
        ]
      }
    );

    if (result.modifiedCount === 0) {
      throw new ApiError(404, "No matching fee structure found to delete");
    }

    return res.status(200).json(
      new ApiResponse(200,null, `Deleted '${title}' from '${feeType}' in ${result.modifiedCount} class(es)`)
    );
  }
});

const getClassFeeStructure = asyncHandler(async(req,res)=>{
    const {className} = req.params;
    if(!className.trim()){
        throw new ApiError(400,"Class Name is required");
    }
    const feeStructure = await FeeStructure.findOne({class:className}).populate("fee.structure");;
    if(!feeStructure){
        throw new ApiError(404,"Fee structure not found");
    }
    return res.status(200).json(new ApiResponse(200,feeStructure,"Fee structure fetched successfully"));
})

const getAllFeeStructures = asyncHandler(async(req,res)=>{
    const feeStructures = await FeeStructure.find().populate("fee.structure");
    if(!feeStructures || feeStructures.length==0){
        throw new ApiError(404,"Fee structures not found");
    }
    return res.status(200).json(new ApiResponse(200,feeStructures,"Fee structures fetched sucessfully"));
});

const getMyFeeStructure = asyncHandler(async(req,res)=>{
  return;
});

export {addFeeStructure,setDueDate, deleteFeeType, getAllFeeStructures , getClassFeeStructure};