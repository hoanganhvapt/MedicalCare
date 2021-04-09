const initialState = {
    dataUser: [],
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case "GET_DATA_USER":
            const newList = [...state.dataUser];
            if (newList.length === 0) {
                newList.push(action.dataUser);
            }
            return {
                ...state,
                dataUser: newList,
            };
        default:
            return state;
    }
};
export default userReducer;
