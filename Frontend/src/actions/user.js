export const getDataUser = (user) => {
    return {
        type: "GET_DATA_USER",
        dataUser: user.dataUser,
    };
};
