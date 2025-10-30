export const getUser = () => {
  try {
    const data = localStorage.getItem("user"); // ← singular "user"
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.warn("Corrupted user data in localStorage:", err);
    return null;
  }
};

export const setUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const clearUser = () => {
  localStorage.removeItem("user");
};