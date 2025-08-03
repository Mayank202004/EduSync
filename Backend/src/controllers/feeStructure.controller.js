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
    const allClasses = await ClassStructure.find({ schoolId: req.school?._id }, "className");
    classList = allClasses.map(c => c.className);
  } else {
    if (!className?.trim()) {
      throw new ApiError(400, "className is required when not adding to all classes");
    }
    classList = [className.trim()];
  }

  for (const currentClass of classList) {
    let feeStructure = await FeeStructure.findOne({ class: currentClass , schoolId: req.school?._id });

    if (!feeStructure) {
      feeStructure = await FeeStructure.create({
        class: currentClass,
        fee: [
          { feeType: "Tuition Fee", structure: [] },
          { feeType: "Transport Fee", structure: [] },
          { feeType: "Other Fee", structure: [] }
        ],
        schoolId: req.school?._id
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
        discount,
        schoolId: req.school?._id
      });
      feeTypeBlock.structure.push(newFeeItem._id);
    }

    await feeStructure.save();
  }
  return res.status(200).json(new ApiResponse(200, null, "Fee structure updated successfully"));
});



// Unutilized (Subjected to removal in future after proper checks are done) To DO:
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
      schoolId: req.school?._id,
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
    const feeStructure = await FeeStructure.findOne({ class: className, schoolId: req.school?._id });
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
    return res.status(200).json(new ApiResponse(200,null, "Fee structure deleted successfully"));

  } else {
    // Delete from all classes
    const result = await FeeStructure.updateMany(
      { schoolId: req.school?._id, "fee.feeType": feeType, "fee.structure.title": title },
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

/**
 * @desc Get fee structure for a specific class
 * @route GET /api/feeStructure/:className
 * @access Private (Super Admin)
 */
const getClassFeeStructure = asyncHandler(async(req,res)=>{
    const {className} = req.params;
    if(!className.trim()){
        throw new ApiError(400,"Class Name is required");
    }
    const feeStructure = await FeeStructure.findOne({class:className,schoolId: req.school?._id}).populate("fee.structure");;
    if(!feeStructure){
        throw new ApiError(404,"Fee structure not found");
    }
    return res.status(200).json(new ApiResponse(200,feeStructure,"Fee structure fetched successfully"));
})

/**
 * @desc Get all fee structures
 * @route GET /api/feeStructure/getAll
 * @access Private (Super Admin)
 */
const getAllFeeStructures = asyncHandler(async(req,res)=>{
    const feeStructures = await FeeStructure.find({schoolId: req.school?._id}).populate("fee.structure");
    return res.status(200).json(new ApiResponse(200,feeStructures,"Fee structures fetched sucessfully"));
});



/**
 * @desc Update a specific fee item or fee item belonging to each class
 * @route PUT /api/feeStructure/update
 * @access Private (Super Admin)
 */
const updateFeeStructure = asyncHandler(async (req, res) => {
  const {
    feeId,
    title,
    feeType,
    amount,
    dueDate,
    discount,
    className,
    updateAllClasses = false,
  } = req.body;

  if (!feeId?.trim() && !title?.trim()) {
    throw new ApiError(400, "At least one of feeId or title is required");
  }
  if (
    !feeType?.trim() ||
    !amount?.toString().trim() ||
    !dueDate?.trim() ||
    !discount?.toString().trim()
  ) {
    throw new ApiError(400, "All fields are required");
  }
  if (!updateAllClasses && !className?.trim()) {
    throw new ApiError(400, "className is required when not updating all classes");
  }

  const updatePayload = {
    title: feeType,
    amount: Number(amount),
    dueDate: new Date(dueDate),
    discount: Number(discount),
  };

  if (updateAllClasses) {
    const result = await FeeItem.updateMany(
      { title: title, schoolId: req.school?._id },
      { $set: updatePayload }
    );

    return res.status(200).json(new ApiResponse(200,null,`Updated ${result.modifiedCount} fee items`));
  } else {
    // Update a specific class
    const updated = await FeeItem.findByIdAndUpdate(feeId, updatePayload);

    if (!updated) {
      throw new ApiError(404, "Fee item not found");
    }
    return res.status(200).json(new ApiResponse(200,null,"Fee item updated successfully"));
  }
});


export {addFeeStructure,setDueDate, deleteFeeType, getAllFeeStructures , getClassFeeStructure, updateFeeStructure};