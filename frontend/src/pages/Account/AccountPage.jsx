import { useAuth } from "../../context/AuthContext";

const AccountPage = ({ section }) => {
  const { user } = useAuth();
  const isProfile = section === "profile";

  return (
    <main className="mx-auto min-h-[60vh] w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-[#4d3d2f]">
        {isProfile ? "My Profile" : "Settings"}
      </h1>
      <section className="mt-6 max-w-xl border border-[#e3d3c2] bg-white p-5 sm:p-7">
        {isProfile && (
          <div className="mb-6 flex items-center gap-4 border-b border-[#e3d3c2] pb-6">
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt={`${user.fullName || "Profile"} profile`}
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f6ede0] text-2xl font-semibold text-[#c8a279]">
                {user?.fullName?.charAt(0)?.toUpperCase() || "?"}
              </div>
            )}
            <p className="font-medium text-[#4d3d2f]">Profile image</p>
          </div>
        )}
        <dl className="space-y-5">
          <div>
            <dt className="text-sm text-[#8c7661]">Full name</dt>
            <dd className="mt-1 break-words font-medium text-[#4d3d2f]">
              {user?.fullName || "Not provided"}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-[#8c7661]">Email address</dt>
            <dd className="mt-1 break-words font-medium text-[#4d3d2f]">
              {user?.email || "Not provided"}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-[#8c7661]">Phone number</dt>
            <dd className="mt-1 break-words font-medium text-[#4d3d2f]">
              {user?.phone || "Not provided"}
            </dd>
          </div>
        </dl>
      </section>
    </main>
  );
};

export default AccountPage;