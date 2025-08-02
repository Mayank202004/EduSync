import School from "../models/school.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";

/**
 * @desc Set school context for each request 
 */

const setSchoolContext = asyncHandler(async (req, _, next) => {
  const host = req.headers.host; // e.g., abc.edusync.live
  const schoolSlug = host.split('.')[0]; // "abc"

  if (!schoolSlug) {
    throw new ApiError(400, "Invalid subdomain or host");
  }

  const school = await School.findOne({ slug: schoolSlug });

  if (!school) {
    throw new ApiError(404, "School not found");
  }

  req.school = {
    id: school._id,
    slug: school.slug,
    name: school.name,
  };

  next();
});

export default setSchoolContext;
