type Props = {
  onClick: () => void;
};

const ScrollButton = ({ onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      className="bg-white border border-gray-300 rounded-lg px-2 py-0.5 text-sm hover:bg-gray-100"
    >
      scroll
    </button>
  );
};

export default ScrollButton;
