type Props = {
  name: string;
  link: string;
};

const Title = ({ name, link }: Props) => {
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

export default Title;
