import { useState, useEffect } from "react";

type ScriptInfo = {
  url: string;
  size: number;
};

type Props = {
  scriptName: string;
};

const ScriptSize = ({ scriptName }: Props) => {
  const [scriptInfo, setScriptInfo] = useState<ScriptInfo>();
  useEffect(() => {
    (async () => {
      const info = await getScriptInfo(scriptName);
      setScriptInfo(info);
    })();
  }, []);

  if (!scriptInfo) {
    return null;
  }

  return (
    <a
      href={scriptInfo.url}
      target="_blank"
      className="text-blue-700 hover:underline"
    >
      {(scriptInfo.size / 1024).toFixed(2)} kB
    </a>
  );
};

async function getScriptInfo(scriptName: string) {
  const url = [...document.querySelectorAll("script,link")]
    .map((e) => ("src" in e ? e.src : "href" in e ? e.href : "") as string)
    .find((e) => e.includes(scriptName));

  if (!url) {
    return;
  }

  const size = (await (await fetch(url)).blob()).size;
  return { url, size };
}

export default ScriptSize;
