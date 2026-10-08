import { createContext, useContext, useMemo, useState } from "react";

const AdminDateFilterContext = createContext(null);
const STORAGE_KEY = "adminDateFilter";

const localDateKey = (date) => {
  const value = new Date(date);
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
};

const currentMonth = () => localDateKey(new Date()).slice(0, 7);

export const AdminDateFilterProvider = ({ children }) => {
  const [refreshVersion, setRefreshVersion] = useState(0);
  const [filter, setFilter] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      const month = typeof saved?.month === "string" && /^\d{4}-\d{2}$/.test(saved.month)
        ? saved.month
        : currentMonth();
      const day = typeof saved?.day === "string" && /^\d{4}-\d{2}-\d{2}$/.test(saved.day) &&
        saved.day.startsWith(month)
        ? saved.day
        : "";
      return { month, day };
    } catch {
      return { month: currentMonth(), day: "" };
    }
  });

  const updateFilter = (next) => {
    setFilter(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const value = useMemo(
    () => ({
      ...filter,
      refreshVersion,
      refreshData: () => setRefreshVersion((version) => version + 1),
      setMonth: (month) => updateFilter({
        month,
        day: filter.day.startsWith(month) ? filter.day : "",
      }),
      setDay: (day) => updateFilter({
        month: day ? day.slice(0, 7) : filter.month,
        day,
      }),
      setToday: () => updateFilter({
        month: currentMonth(),
        day: localDateKey(new Date()),
      }),
    }),
    [filter, refreshVersion]
  );

  return (
    <AdminDateFilterContext.Provider value={value}>
      {children}
    </AdminDateFilterContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAdminDateFilter = () => {
  const context = useContext(AdminDateFilterContext);
  if (!context) {
    throw new Error("useAdminDateFilter must be used within AdminDateFilterProvider.");
  }
  return context;
};

// eslint-disable-next-line react-refresh/only-export-components
export const getAdminDateRange = ({ month, day }) => {
  const startKey = day || `${month}-01`;
  const [year, monthNumber, dayNumber] = startKey.split("-").map(Number);
  const start = new Date(year, monthNumber - 1, day ? dayNumber : 1);
  const end = day
    ? new Date(year, monthNumber - 1, dayNumber + 1)
    : new Date(year, monthNumber, 1);
  return { start, end };
};
