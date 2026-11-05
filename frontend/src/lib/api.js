const API_BASE = (
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? "https://wedding-card-ns.onrender.com" : "")
).replace(/\/$/, "");

async function readJson(response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

// Clear any stale local blessings from previous sessions
if (typeof window !== "undefined") {
  try {
    localStorage.removeItem("sn-blessings-local");
  } catch {}
}

/**
 * Fetch live blessings strictly from MongoDB Atlas.
 * When an entry is deleted in MongoDB Atlas, it will no longer be returned.
 */
export async function fetchBlessings() {
  try {
    const response = await fetch(`${API_BASE}/api/messages`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    const data = await readJson(response);
    if (!response.ok) throw new Error(data.error || "The blessing wall is unavailable.");
    return {
      messages: Array.isArray(data.messages) ? data.messages : [],
      source: "live",
    };
  } catch (error) {
    console.error("[fetchBlessings]", error.message);
    return { messages: [], source: "error" };
  }
}

/**
 * Submit a blessing strictly to MongoDB Atlas.
 */
export async function createBlessing(payload) {
  const response = await fetch(`${API_BASE}/api/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await readJson(response);

  if (!response.ok) {
    throw new Error(data.error || "Please check your name and message.");
  }

  return { message: data.message, source: "live" };
}
