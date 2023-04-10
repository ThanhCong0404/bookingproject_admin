import { createContext, useEffect, useReducer } from "react";
// Context dùng để truyền dữ liệu giữa các component trong cây component của ứng dụng React mà không cần thông qua các prop từng cấp.

const INIT_STATE= { //khởi tạo state ban đầu 
    user:  JSON.parse(localStorage.getItem("user")) || null,
    loading: false, // state enable/disable  button login
    error: null,


}

export const AuthContext= createContext(INIT_STATE);

const AuthReducer = (state,action) => {
    switch(action.type){
        case "LOGIN_START": 
            return {
                user:null,
                loading: true,
                error: null,          
            
            };
        case "LOGIN_SUCCESS": 
            return {
                user: action.payload,
                loading: false,
                error: null,          
            
            };
        case "LOGIN_FAILURE": 
            return {
                user:null,
                loading: false,
                error: action.payload,          
            
            };
        case "LOGOUT": 
            return {
                user:null,
                loading: false,
                error: null,          
            
            };
        default:
            return state;
    }
}

export const AuthContextProvider = ({children}) => {
    const [state,dispatch] = useReducer(AuthReducer,INIT_STATE);//nhận vào 2 tham số: reducer function và initial state.giá trị trả về của reducer function sẽ được lưu vào biến `state`, và hàm thay đổi state có tên là `dispatch`.

    useEffect(()=>{
        localStorage.setItem("user",JSON.stringify(state.user));
    },[state.user])

    // truyền giá trị cần lưu trữ trong context vào `value` của `AuthContext.Provider`, trong đó giá trị này chứa các keys là `city`, `dates`, `options` và `dispatch`. Nếu các components con muốn sử dụng context này, chúng cần phải wrap bên trong `AuthContextProvider` và sử dụng hook `useContext(AuthContext)` để truy cập vào các values này.
    return (
        <AuthContext.Provider value={{user:state.user, loading:state.loading, error:state.error, dispatch}}>
            {children}
        </AuthContext.Provider>
    )
}