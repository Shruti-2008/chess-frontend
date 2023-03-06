import { MdNavigateNext, MdFirstPage, MdLastPage } from "react-icons/md";

function Navigation() {
  const btnNavigationStyle =
    "text-4xl lg:text-4xl xl:text-5xl from-amber-400 to-amber-200 bg-gradient-to-t p-2 rounded-xl font-semibold shadow-lg transition duration-300 hover:ring-4 hover:ring-amber-200 hover:ring-offset-2 hover:ring-offset-amber-200";

  return (
    <div className="flex items-center justify-center gap-4">
      <button className={btnNavigationStyle}>
        <MdFirstPage />
      </button>
      <button className={btnNavigationStyle}>
        <MdNavigateNext />
      </button>
      <button className={btnNavigationStyle}>
        <MdLastPage />
      </button>
    </div>
  );
}

export default Navigation;
