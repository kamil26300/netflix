export const Card = ({ item, handleCardClick, type }) => {
  return (
    <div
      className="h-full min-w-max relative cursor-pointer group/item overflow-hidden"
      onClick={() => handleCardClick(type, item.id)}
    >
      <img src={item.image} alt="thumbnail" className="w-full h-full z-10" />
      <div className="absolute w-full h-1/3 bg-black/60 bottom-0 translate-y-full text-center justify-center items-center flex group-hover/item:translate-y-0 duration-300 ease-in-out font-extrabold p-2 text-xs md:text-sm">
        {item.title || item.name}
      </div>
    </div>
  );
};

export const Loader = ({ length, visibility }) => {
  return (
    <div className={`${visibility} w-full gap-1`}>
      {Array.from({ length: length }).map((_, index) => (
        <div
          key={index}
          className="bg-zinc-900 rounded-md overflow-hidden shadow-md animate-pulse h-full w-full"
        ></div>
      ))}
    </div>
  );
};