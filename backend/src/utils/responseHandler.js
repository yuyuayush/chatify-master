export const responseSuccess = (res, data, message = "Success", statusCode = 200) => {
    return res.status(statusCode).json({
        status: "success",
        message,
        data,
    });
};

export const responseError = (res, errorMessage = "Error", statusCode = 500) => {
    return res.status(statusCode).json({
        status: "error",
        message: errorMessage,
    });
};