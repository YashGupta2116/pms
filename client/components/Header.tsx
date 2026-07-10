import React from "react";

type Props = {
  name: string;
  buttonComponent?: any;
  isSmallText?: boolean;
};

const Header = ({ name, buttonComponent, isSmallText = false }: Props) => {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between w-full">
      <h1
        className={`${isSmallText ? "text-lg" : "text-2xl"} font-semibold dark:text-white break-words`}
      >
        {name}
      </h1>
      {buttonComponent && (
        <div className="flex shrink-0 items-center">
          {buttonComponent}
        </div>
      )}
    </div>
  );
};

export default Header;
