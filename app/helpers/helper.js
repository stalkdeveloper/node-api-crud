function getStandardResponse(status, message, data) {
    return {
        status: status,
        message: message,
        data: data
    };
}

const successResponse = (message, data) => {
    return getStandardResponse('success', message, data);
};


const errorResponse = (message, data = null) => {
    return getStandardResponse('error', message, data);
};

module.exports = {
    successResponse,
    errorResponse
};