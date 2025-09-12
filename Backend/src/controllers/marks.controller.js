import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import puppeteer from "puppeteer";
import ejs from "ejs";
import { Student } from "../models/student.model.js";


export const exportClassMarkSheet = asyncHandler(async (req, res) => {
  const { className, div } = req.body;

  if(!className?.trim() || !div?.trim()){
    throw new ApiError(400,"Class and div are required");
  }

  const students = await Student.find({
    schoolId: req.school._id,
    class: className,
    div
  })
    .select("_id userId")
    .populate("userId", "fullName")
    .sort({ "userId.fullName": 1 })
    .lean();


  if (!students.length) {
    throw new ApiError(404, "No students found for given class/div");
  }

  const html = await ejs.renderFile("src/templates/classMarksheet.template.ejs", {
    students,
    className,
    div
  });

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });
  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: "10mm", right: "15mm", bottom: "10mm", left: "15mm" }
  });
  await browser.close();

  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": `inline; filename="marksheet-${className}${div}.pdf"`,
    "Content-Length": pdfBuffer.length,
  });

  res.send(pdfBuffer);
});