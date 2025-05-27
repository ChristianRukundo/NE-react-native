import type { User, Expense, CreateExpenseData, LoginData } from "./types";

const API_BASE_URL = "https://67ac71475853dfff53dab929.mockapi.io/api/v1";

// Add timeout and better error handling
const fetchWithTimeout = async (
  url: string,
  options: RequestInit = {},
  timeout = 10000
) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new Error("Request timed out. Please check your connection.");
      }
      throw new Error(`Network error: ${error.message}`);
    }
    throw new Error("An unexpected error occurred");
  }
};

export const financeApi = {
  // Auth endpoints
  async login(credentials: LoginData): Promise<User | null> {
    try {
      const response = await fetchWithTimeout(
        `${API_BASE_URL}/users?username=${credentials.username}`
      );
      const users: User[] = await response.json();
      const user = users.find((u) => u.username === credentials.username);

      if (user && user.password === credentials.password) {
        return user;
      }
      return null;
    } catch (error) {
      console.error("Login error:", error);
      throw new Error(
        "Login failed. Please check your credentials and try again."
      );
    }
  },

  // Expense endpoints
  async getExpenses(): Promise<Expense[]> {
    try {
      const response = await fetchWithTimeout(
        `${API_BASE_URL}/expenses`,
        {},
        15000
      ); // 15 second timeout for expenses
      const expenses: Expense[] = await response.json();

      // Sort by creation date (newest first) on the client side for better UX
      return expenses.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error("Get expenses error:", error);
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error(
        "Failed to load expenses. Please check your connection and try again."
      );
    }
  },

  async getExpenseById(id: string): Promise<Expense> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/expenses/${id}`);
      return await response.json();
    } catch (error) {
      console.error("Get expense error:", error);
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Failed to load expense details. Please try again.");
    }
  },

  async createExpense(data: CreateExpenseData): Promise<Expense> {
    try {
      const expenseData = {
        ...data,
        userId: "1", // Default user ID for now
        createdAt: new Date().toISOString(),
      };

      const response = await fetchWithTimeout(`${API_BASE_URL}/expenses`, {
        method: "POST",
        body: JSON.stringify(expenseData),
      });

      return await response.json();
    } catch (error) {
      console.error("Create expense error:", error);
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Failed to create expense. Please try again.");
    }
  },

  async deleteExpense(id: string): Promise<void> {
    try {
      await fetchWithTimeout(`${API_BASE_URL}/expenses/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Delete expense error:", error);
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Failed to delete expense. Please try again.");
    }
  },
};
