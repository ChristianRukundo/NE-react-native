import axios from "axios";

const MOCK_API_BASE_URL = "https://681cce38f74de1d219addd1b.mockapi.io/api/v1";

const api = axios.create({
  baseURL: MOCK_API_BASE_URL,
  timeout: 10000,
});

export const vehicleApi = {
  getAll: async () => {
    console.log(`GET ${MOCK_API_BASE_URL}/vehicles`);
    const response = await api.get("/vehicles");
    return { data: response.data };
  },

  getById: async (id: string) => {
    console.log(`GET ${MOCK_API_BASE_URL}/vehicles/${id}`);
    const response = await api.get(`/vehicles/${id}`);
    return { data: response.data };
  },

  create: async (data: any) => {
    console.log(`POST ${MOCK_API_BASE_URL}/vehicles`, data);
    const response = await api.post("/vehicles", data);
    return { data: response.data };
  },

  update: async (id: string, data: any) => {
    console.log(`PUT ${MOCK_API_BASE_URL}/vehicles/${id}`, data);
    const response = await api.put(`/vehicles/${id}`, data);
    return { data: response.data };
  },

  delete: async (id: string) => {
    console.log(`DELETE ${MOCK_API_BASE_URL}/vehicles/${id}`);
    const response = await api.delete(`/vehicles/${id}`);
    return { data: { success: true, deletedItem: response.data } };
  },
};

export const parkingSlotApi = {
  getAll: async () => {
    console.log(`GET ${MOCK_API_BASE_URL}/parkingSlot`);
    const response = await api.get("/parkingSlot");
    return { data: response.data };
  },

  getById: async (id: string) => {
    console.log(`GET ${MOCK_API_BASE_URL}/parkingSlot/${id}`);
    const response = await api.get(`/parkingSlot/${id}`);
    return { data: response.data };
  },

  create: async (data: any) => {
    console.log(`POST ${MOCK_API_BASE_URL}/parkingSlot`, data);
    const response = await api.post("/parkingSlot", data);
    return { data: response.data };
  },

  update: async (id: string, data: any) => {
    console.log(`PUT ${MOCK_API_BASE_URL}/parkingSlot/${id}`, data);
    const response = await api.put(`/parkingSlot/${id}`, data);
    return { data: response.data };
  },

  delete: async (id: string) => {
    console.log(`DELETE ${MOCK_API_BASE_URL}/parkingSlot/${id}`);
    const response = await api.delete(`/parkingSlot/${id}`);
    return { data: { success: true, deletedItem: response.data } };
  },
};

export const profileApi = {
  get: async () => {
    const profileId = "1";
    console.log(`GET ${MOCK_API_BASE_URL}/profile/${profileId}`);
    try {
      const response = await api.get(`/profile/${profileId}`);
      return { data: response.data };
    } catch (error) {
      console.warn(
        "Failed to fetch profile, returning default mock. Ensure 'profile' resource with ID 1 exists on mockapi.io.",
        error
      );
      return {
        data: {
          id: "1",
          fullName: "Hannah Turin (Default)",
          email: "hannah.default@example.com",
          phoneNumber: "+1 123 456 7890",
          address: "123 Mock Street",
          zipCode: "10001",
          state: "Mock State",
        },
      };
    }
  },

  update: async (data: any) => {
    const profileId = data.id || "1";
    console.log(`PUT ${MOCK_API_BASE_URL}/profile/${profileId}`, data);

    const response = await api.put(`/profile/${profileId}`, data);
    return { data: response.data };
  },
};

export const authApi = {
  login: async (data: { email: string; password: string }) => {
    console.log("MOCK authApi.login called with:", data);
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (
      data.email === "hannah.turin@email.com" &&
      data.password === "password"
    ) {
      return {
        success: true,
        message: "Login successful",
        token: "mock-jwt-token-from-successful-login",
        user: {
          id: "1",
          fullName: "Hannah Turin",
          email: "hannah.turin@email.com",
        },
      };
    } else {
      throw {
        response: { status: 401, data: { message: "Invalid credentials" } },
      };
    }
  },

  register: async (data: any) => {
    console.log("MOCK authApi.register called with:", data);

    await new Promise((resolve) => setTimeout(resolve, 800));
    return {
      success: true,
      message: "Registration successful. Please verify your phone/email.",
    };
  },

  verifyOtp: async (data: { phone: string; otp: string }) => {
    console.log("MOCK authApi.verifyOtp called with:", data);
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (data.otp === "1234") {
      return {
        success: true,
        message: "OTP verified successfully.",
        token: "mock-jwt-token-from-otp-verification",
        user: {
          id: "1",
          fullName: "Verified User",
          email: "verified@example.com",
        },
      };
    } else {
      throw {
        response: { status: 400, data: { message: "Invalid OTP code" } },
      };
    }
  },

  resendOtp: async (phone: string) => {
    console.log("MOCK authApi.resendOtp called for phone:", phone);
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      success: true,
      message: "A new OTP has been sent.",
    };
  },
};

export default api;
