const Skeleton = () => {
  return (
    <div className="p-5 pb-3 relative mt-10 shadow-lg outline-2 outline-gray-50 rounded-3xl mx-5 md:mx-0 pointer-events-none animate-pulse">
      <div className="flex items-center border-gray-200 gap-5 pb-3">
        <div className="w-10 h-10 rounded-full bg-gray-300"></div>
        <div className="flex flex-col">
          <span className="bg-gray-300 w-20 h-5 m-1"></span>
          <span className="bg-gray-300 w-10 h-2 m-1"></span>
        </div>
      </div>
      <div>
        <p className="bg-gray-300 w-full h-5"></p>
      </div>
      <div>
        <ul className="pt-3 flex gap-5 items-center text-sm sm:text-base">
          <li className="cursor-pointer flex items-center gap-2">
            <span className="h-4 bg-gray-300 w-16"></span>
          </li>
          <li className="cursor-pointer flex items-center gap-2">
            <span className="h-4 bg-gray-300 w-16"></span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Skeleton;
