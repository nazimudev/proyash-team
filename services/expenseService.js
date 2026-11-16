const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Common headers
const getHeaders = () => ({
  Accept: "application/json",
  Authorization: `Bearer ${
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : ""
  }`,
});

// Common response handler

async function handleResponse(response) {
  const contentType = response.headers.get("content-type");

  let result = {};

  if (contentType?.includes("application/json")) {
    result = await response.json();
  } else {
    const text = await response.text();
    result = {
      message: text || "Server returned a non-JSON response.",
    };
  }

  if (!response.ok) {
    console.error("Expense API Error:", {
      status: response.status,
      statusText: response.statusText,
      response: result,
    });

    const error = new Error(
      result.message || `Request failed (${response.status})`,
    );

    error.status = response.status;
    error.errors = result.errors || {};
    error.response = result;

    throw error;
  }

  return result;
}


// Convert Expense Form values into Laravel FormData


function prepareExpenseData(data) {
  const formData = new FormData();

  formData.append("title", data.title);

  formData.append("expense_category_id", String(data.expense_category_id));

  formData.append("expense_type", data.expense_type);

  formData.append("amount", String(data.amount));

  formData.append("expense_date", data.expense_date);

  formData.append("payment_method", data.payment_method);

  if (data.expense_type === "project" && data.project_id) {
    formData.append("project_id", String(data.project_id));
  }

  if (data.paid_to) {
    formData.append("paid_to", data.paid_to);
  }

  if (data.description) {
    formData.append("description", data.description);
  }

  if (data.receipt instanceof File) {
    formData.append("receipt", data.receipt);
  }

  return formData;
}



// Get all expenses with filters and pagination
export async function fetchExpenses(params = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, value);
    }
  });

  const url = `${API_URL}/admin/expenses${
    query.toString() ? `?${query.toString()}` : ""
  }`;

  const response = await fetch(url, {
    method: "GET",
    headers: getHeaders(),
    cache: "no-store",
  });

  const result = await handleResponse(response);

  return result.data;
}

// Get single expense
export async function fetchExpenseById(id) {
  const response = await fetch(`${API_URL}/admin/expenses/${id}`, {
    method: "GET",
    headers: getHeaders(),
    cache: "no-store",
  });

  const result = await handleResponse(response);

  return result.data;
}

// Create new expense

// Create new expense
export async function createExpense(data) {
  const formData = prepareExpenseData(data);

  const response = await fetch(`${API_URL}/admin/expenses`, {
    method: "POST",
    headers: getHeaders(),
    body: formData,
  });

  return await handleResponse(response);
}


// Update existing expense
export async function updateExpense(id, data) {
  const formData = prepareExpenseData(data);

  // Laravel method spoofing for multipart form data
  formData.append("_method", "PUT");

  const response = await fetch(`${API_URL}/admin/expenses/${id}`, {
    method: "POST",
    headers: getHeaders(),
    body: formData,
  });

  return await handleResponse(response);
}

// Delete expense
export async function deleteExpense(id) {
  const response = await fetch(`${API_URL}/admin/expenses/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  return await handleResponse(response);
}
