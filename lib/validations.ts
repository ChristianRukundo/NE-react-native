import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"), // ADDED
    lastName: z.string().min(2, "Last name must be at least 2 characters"), // ADDED
    email: z.string().email("Invalid email address"),
    // address: z.string().min(5, "Address is too short"), // REMOVED based on image, add back if needed
    // zipCode: z.string().regex(/^\d{5}$/, "Invalid zip code"), // REMOVED based on image, add back if needed
    // state: z.string().min(1, "State is required"), // REMOVED based on image, add back if needed
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const otpSchema = z.object({
  otp: z.string().length(4, "Please enter a 4-digit code"),
});
export const vehicleSchema = z.object({
  licensePlate: z.string().min(1, "License plate is required").max(20, "License plate too long"),
  vehicleType: z.enum(["Car", "Motorcycle", "Truck", "Van"], {
    required_error: "Please select a vehicle type",
  }),
  ownerName: z.string().min(2, "Owner name must be at least 2 characters"),
  contactNumber: z.string().min(10, "Contact number must be at least 10 digits"),
})

export const parkingSlotSchema = z.object({
  slotNumber: z.string().min(1, "Slot number is required"),
  status: z.enum(["Available", "Occupied"], {
    required_error: "Please select a status",
  }),
  type: z.enum(["Standard", "EV Charger", "Disabled"], {
    required_error: "Please select a slot type",
  }),
})

export const profileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(5, "Please enter a valid address"),
  zipCode: z.string().min(5, "Please enter a valid zip code"),
  state: z.string().min(1, "Please select a state"),
})

export type VehicleFormData = z.infer<typeof vehicleSchema>
export type ParkingSlotFormData = z.infer<typeof parkingSlotSchema>
export type ProfileFormData = z.infer<typeof profileSchema>
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type OtpFormData = z.infer<typeof otpSchema>;
