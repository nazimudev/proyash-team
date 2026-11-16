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

export async function getPublicTeamMembers() {
  return request("/public/member-list");
}

export async function getPublicAdvisors() {
  return request("/public/advisors");
}
