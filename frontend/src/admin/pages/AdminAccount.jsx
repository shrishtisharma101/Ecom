import { useLocation } from "react-router-dom";
import AdminPageHeader from "../components/AdminPageHeader";

const AdminAccount = () => {
  const { pathname } = useLocation();
  const admin = JSON.parse(localStorage.getItem("admin") || "null");
  const isSettingsPage = pathname.endsWith("/settings");

  return (
    <section className="p-3">
      <AdminPageHeader
        title={isSettingsPage ? "Settings" : "My Profile"}
        description="Administrator account"
      />

      <div className="max-w-xl rounded-2xl border border-[#e3d3c2] bg-white p-5 shadow-sm sm:p-6">
        {isSettingsPage ? (
          <>
            <h2 className="text-lg font-semibold text-[#4d3d2f]">Account settings</h2>
            <p className="mt-2 text-sm text-[#8c7661]">
              You are signed in as {admin?.email || "Admin"}. Sign out from the profile menu or sidebar to end this admin session.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-[#4d3d2f]">{admin?.name || "Admin"}</h2>
            <p className="mt-1 text-sm text-[#8c7661]">{admin?.email || "Administrator account"}</p>
            <p className="mt-4 border-t border-[#eee4da] pt-4 text-sm text-[#8c7661]">
              Role: Administrator
            </p>
          </>
        )}
      </div>
    </section>
  );
};

export default AdminAccount;
