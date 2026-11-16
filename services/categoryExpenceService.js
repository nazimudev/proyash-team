const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getHeaders = () => ({
  Accept: "application/json",
  Authorization: `Bearer ${
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : ""
  }`,
});

// Get all expense categories
export async function fetchExpenseCategories(params = {}) {
  const query = new URLSearchParams({
    per_page: 100,
    ...params,
  });

  const response = await fetch(
    `${API_URL}/admin/expense-categories?${query.toString()}`,
    {
      method: "GET",
      headers: getHeaders(),
      cache: "no-store",
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch expense categories.");
  }

  return result.data?.data || [];
}

// Get active expense categories only
// Get active expense categories only
export async function fetchActiveExpenseCategories() {
  const categories = await fetchExpenseCategories();

  console.log("All categories:", categories);

  const activeCategories = categories.filter(
    (category) => category.is_active == true
  );

  console.log("Active categories:", activeCategories);

  return activeCategories;
}
