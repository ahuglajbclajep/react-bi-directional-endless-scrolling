type TitleProps = {
  name: string;
  link: string;
};

export const Title = ({ name, link }: TitleProps) => {
  return (
    <h1 className="text-xl">
      <a
        href={link}
        className="hover:underline"
        target="_blank"
        rel="noreferrer"
      >
        {name}
      </a>{" "}
      example
    </h1>
  );
};

type ScrollButtonProps = {
  onClick: () => void;
};

export const ScrollButton = ({ onClick }: ScrollButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="bg-white border border-gray-300 rounded-lg px-2 py-0.5 text-sm hover:bg-gray-100"
    >
      scroll
    </button>
  );
};
