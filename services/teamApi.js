const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function request(endpoint) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      Accept: "application/json",
    },
    next: {
      revalidate: 60,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${endpoint}`);
  }

  const result = await response.json();

  return result.data ?? [];
}


export async function getPublicTeamMembers(page = 1) {
  const response = await fetch(`${API_URL}/public/member-list?page=${page}`, {
    next: {
      revalidate: 300,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch team members");
  }

  return response.json();
}


export async function getPublicAdvisors() {
  return request("/public/advisors");
}
