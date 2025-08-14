import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import connectionsReducer from "./features/connectionsSlice";
import messagesReducer from "./features/messagesSlice";

export const store = configureStore({
    reducer: {
        user: userReducer,
        connections: connectionsReducer,
        messages: messagesReducer,
    },
});
