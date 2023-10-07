import React from "react";

const CustomDropdown = ({ options, value, onChange }) => {
  return (
    <div className="relative inline-flex">
      <select
        className="  block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline-blue focus:border-blue-300"
        value={value}
        onChange={onChange}
      >
        {options.map((option) => (
          <option
            className="text-xs md:text-base"
            key={option.value}
            value={option.value}
          >
            {option.name}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg
          className="fill-current h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M7.293 5.293a1 1 0 011.414 0L10 6.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
};

export default CustomDropdown;
