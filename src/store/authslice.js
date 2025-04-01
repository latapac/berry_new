import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userStatus:false,
    userData:null,
}

const adminIntialState = {
    adminData:null,
    adminStatus:false,
}

const authSlice = createSlice({
    name:"authSlice",
    initialState,
    reducers:{
        login:(state,action)=>{
            state.userStatus = true;
            state.userData = action.payload;
        },
        logout:(state,action)=>{
            state.userStatus = false;
            state.userData = null;
        }
    }
})

const adminAuthSice = createSlice({
    name:"authSlice",
    initialState:adminIntialState,
    reducers:{
        adminLogin:(state,action)=>{
            state.adminStatus = true;
            state.adminData = action.payload;
        },
        adminLogout:(state,action)=>{
            state.adminStatus = false;
            state.adminData = null;
        }
    }
})

export const {login,logout} = authSlice.actions;

export const {adminLogin,adminLogout} = adminAuthSice.actions;

export const authReducer = authSlice.reducer;
export const authAdminReducer = adminAuthSice.reducer;