export const createError = (error: Error) => {
    if (
        error &&
        error.message ===
            // eslint-disable-next-line max-len
            "SecurityError: Failed to read the 'localStorage' property from 'Window': Access is denied for this document."
    ) {
        return {
            ...error,
            message:
                'Local storage is not available! It is possible that the Browser is in incognito mode!',
        };
    }

    return error;
};
