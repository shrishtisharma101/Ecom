import { useRef, useState } from "react";
import { FaCalendarAlt, FaChevronLeft, FaChevronRight, FaRegCalendarCheck, FaSyncAlt } from "react-icons/fa";
import { useAdminDateFilter } from "../context/AdminDateFilterContext";

const localDateKey = (date) => {
  const value = new Date(date);
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
};

const AdminDateFilterBar = () => {
  const { month, day, setMonth, setDay, setToday, refreshData } = useAdminDateFilter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const dateInputRef = useRef(null);
  const today = localDateKey(new Date());
  const todayMonth = today.slice(0, 7);
  const maxDay = month === today.slice(0, 7)
    ? today
    : localDateKey(new Date(Number(month.slice(0, 4)), Number(month.slice(5, 7)), 0));
  const monthName = new Date(`${month}-01T00:00:00`).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
  const changeMonth = (offset) => {
    const [year, monthNumber] = month.split("-").map(Number);
    const next = new Date(year, monthNumber - 1 + offset, 1);
    const nextMonth = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}`;
    if (nextMonth <= todayMonth) setMonth(nextMonth);
  };
  const openDatePicker = () => {
    const input = dateInputRef.current;
    if (!input) return;
    if (typeof input.showPicker === "function") {
      input.showPicker();
      return;
    }
    input.focus();
    input.click();
  };

  return (
    <section className="relative z-20 flex flex-wrap items-center justify-between gap-3 border-b border-[#e8ddcf] bg-[#fffdfa] px-4 py-3 sm:px-6">
      <div className="flex min-w-0 items-center gap-2 text-sm font-semibold text-[#4d3d2f]">
        <FaCalendarAlt className="shrink-0 text-[#a8794e]" />
        <span>Report calendar</span>
        
        <span className="hidden text-xs font-normal text-[#8c7661] sm:inline">
          {day ? new Date(`${day}T00:00:00`).toLocaleDateString("en-IN", { dateStyle: "medium" }) : monthName}
        </span>
      </div>
      <div className="flex w-full flex-wrap items-end gap-2 sm:w-auto">
        <div className="flex flex-col gap-1 text-[10px] font-semibold uppercase tracking-wide text-[#8c7661]">
          <span>Month</span>
          <div className="flex h-9 items-center overflow-hidden rounded-lg border border-[#e3d3c2] bg-white">
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              aria-label="Previous month"
              className="flex h-full w-8 items-center justify-center text-[#8c7661] hover:bg-[#f5ece3] hover:text-[#4d3d2f]"
            >
              <FaChevronLeft size={10} />
            </button>
            <input
              type="month"
              value={month}
              max={todayMonth}
              onChange={(event) => {
                if (event.target.value && event.target.value <= todayMonth) {
                  setMonth(event.target.value);
                }
              }}
              aria-label="Select report month"
              className="h-full min-w-0 border-0 bg-transparent px-1 text-xs font-medium normal-case tracking-normal text-[#4d3d2f] outline-none focus:ring-0"
            />
            <button
              type="button"
              onClick={() => changeMonth(1)}
              disabled={month >= todayMonth}
              aria-label="Next month"
              className="flex h-full w-8 items-center justify-center text-[#8c7661] hover:bg-[#f5ece3] hover:text-[#4d3d2f] disabled:cursor-not-allowed disabled:opacity-35"
            >
              <FaChevronRight size={10} />
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-1 text-[10px] font-semibold uppercase tracking-wide text-[#8c7661]">
          <span>Specific day</span>
          <button
            type="button"
            onClick={openDatePicker}
            aria-label="Open calendar to select a day"
            className={`flex h-9 items-center gap-2 rounded-lg border px-3 text-xs font-semibold normal-case tracking-normal transition ${
              day
                ? "border-[#a8794e] bg-[#fbf6ef] text-[#7a5635]"
                : "border-[#e3d3c2] bg-white text-[#6b5a49] hover:bg-[#f5ece3]"
            }`}
          >
            <FaRegCalendarCheck className="text-[#a8794e]" />
            {day ? new Date(`${day}T00:00:00`).toLocaleDateString("en-IN", { dateStyle: "medium" }) : "Choose date"}
          </button>
          <input
            ref={dateInputRef}
            type="date"
            value={day}
            min={`${month}-01`}
            max={maxDay}
            onChange={(event) => setDay(event.target.value)}
            aria-label="Select a report date"
            tabIndex={-1}
            className="pointer-events-none absolute h-px w-px opacity-0"
          />
        </div>
        <button
          type="button"
          onClick={setToday}
          aria-pressed={day === today}
          className={`h-9 rounded-lg px-3 text-xs font-semibold transition ${
            day === today
              ? "bg-[#8c6847] text-white"
              : "border border-[#e3d3c2] bg-white text-[#6b5a49] hover:bg-[#f5ece3]"
          }`}
        >
          Today
        </button>
        {day && (
          <button
            type="button"
            onClick={() => setDay("")}
            className="h-9 rounded-lg px-2 text-xs font-semibold text-[#a8794e] hover:bg-[#f5ece3]"
          >
            Month view
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            refreshData();
            setIsRefreshing(true);
            window.setTimeout(() => setIsRefreshing(false), 700);
          }}
          aria-label="Refresh admin data"
          title="Refresh admin data"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#e3d3c2] bg-white text-[#8c6847] transition hover:bg-[#f5ece3] disabled:cursor-wait"
        >
          <FaSyncAlt size={12} className={isRefreshing ? "animate-spin" : ""} />
        </button>
      </div>
    </section>
  );
};

export default AdminDateFilterBar;
