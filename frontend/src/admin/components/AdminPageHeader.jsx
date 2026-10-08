const AdminPageHeader = ({ title, description, aside }) => (
  <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
    <div className="min-w-0 text-left">
      <h1 className="text-lg font-bold text-[#4d3d2f] sm:text-xl">{title}</h1>
      {description && <p className="mt-0.5 text-xs text-[#8c7661] sm:text-sm">{description}</p>}
    </div>
    <div className="flex shrink-0 items-center gap-3">
      {aside}
    </div>
  </header>
);

export default AdminPageHeader;
