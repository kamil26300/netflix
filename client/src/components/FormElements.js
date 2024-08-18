export const Input = ({ value, handleFormChange, error, name, label, type }) => {
  return (
    <>
      <div className="relative bg-zinc-700">
        <input
          type={type || name}
          className="relative text-zinc-300 border rounded bg-transparent px-6 py-3 text-base w-full z-10 focus:outline-none border-none"
          value={value}
          onChange={handleFormChange}
          name={name}
          placeholder="&#x200B;"
        />
        <label
          className="absolute text-zinc-300 font-bold top-0 translate-y-1/2 left-6 z-0 duration-150 ease-in-out"
          htmlFor={name}
        >
          {label}
        </label>
      </div>
      <div className="text-red-600 text-sm mb-6">{error}</div>
    </>
  );
};

export const Button = ({ handleLogin, disabled, children }) => {
  return (
    <button
      className="w-full mx-auto py-2 px-4 bg-[#e50914] cursor-pointer border-none text-white font-extrabold text-base rounded disabled:opacity-60 disabled:cursor-not-allowed"
      onClick={handleLogin}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
