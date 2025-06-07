import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';

/**
 * @desc Takes a list of middlewares and allows request to continue if any one passes
 * @param {Array<Function>} middlewares 
 */
const orMiddleware = (middlewares) =>
  asyncHandler(async (req, res, next) => {
    for (const middleware of middlewares) {
      try {
        await new Promise((resolve, reject) => {
          middleware(req, res, (err) => {
            if (err) reject(err);
            else resolve();
          });
        });

        // If middleware passed without error, allow request
        return next();
      } catch (err) {
        // Try next middleware
      }
    }

    // If none passed, throw
    throw new ApiError(403, 'Forbidden: You do not have permission to access this resource.');
  });

export {orMiddleware};