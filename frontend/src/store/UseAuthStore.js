
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
authuser: null,
ischecking: true, 
isSigningUp: false,


checkAuth: async () => {
try { const response = await axiosInstance.get("/auth/check");
    set({ authuser: response.data}); 
} catch (error) {
    console.error("Error checking auth:", error);
    set({ authuser: null });
} finally{
    set({ ischecking: false });
}
},
signup: async (data) => {
set({ isSigningUp: true });

try {
    const res = await axiosInstance.post("/auth/signup", data);
    set({ authuser: res.data });

    toast.success("Signup successful!");
} catch (error) {
    toast.error(error.response.data.message || "Signup failed. Please try again.");
} finally{
    set({ isSigningUp: false });
}

}

}))