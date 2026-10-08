export const clearAdminSession = () => {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("admin");
};
