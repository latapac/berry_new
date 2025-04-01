import { configureStore } from "@reduxjs/toolkit";
import { authReducer ,authAdminReducer} from "./authslice";

const store = configureStore({
    reducer:{ 
        authSlice:authReducer,
        adminAuth:authAdminReducer
    }
})

export default store;