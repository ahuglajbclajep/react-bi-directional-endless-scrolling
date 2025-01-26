import { useCallback, useState } from "react";
import { Handle } from "./useScrollTo";

type Props = Handle;

const ScrollPanel = ({ scrollTo }: Props) => {
  const [inputIndex, setInputIndex] = useState(0);
  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const inputIndex = Number(e.currentTarget.value);
    if (!Number.isNaN(inputIndex)) {
      setInputIndex(inputIndex);
    }
  }, []);

  const onClick = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      scrollTo(inputIndex);
    },
    [inputIndex],
  );

  return (
    <form className="flex flex-row gap-1" onSubmit={onClick}>
      <Button disabled={inputIndex === 0}>scroll to</Button>
      <input
        type="text"
        inputMode="numeric"
        pattern="\d*"
        placeholder="1000000"
        value={inputIndex || ""}
        onChange={onChange}
        className="border border-gray-300 rounded-md focus:border-blue-300 px-1"
      />
    </form>
  );
};

const Button = ({
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className="bg-white border border-gray-300 rounded-lg px-2 py-0.5 text-sm hover:bg-gray-100"
      {...props}
    />
  );
};

export default ScrollPanel;
