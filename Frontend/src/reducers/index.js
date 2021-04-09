import { combineReducers } from "redux";
import configReducer from "./config";
import userReducer from "./user";

const rootReducer = combineReducers({
    user: userReducer,
    config: configReducer,
});
export default rootReducer;
