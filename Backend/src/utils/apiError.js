/**
 * @class ApiError
 * @extends Error
 * @desc Custom error class for standardizing API error responses.
 * @param {number} statusCode - HTTP status code for the error.
 * @param {String} message - Error message to be returned.
 * @param {Array} errors - Optional array for additional error details.
 * @param {String} stack - stack trace for debugging
 */
class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.success = false;
        this.errors = errors;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError };
