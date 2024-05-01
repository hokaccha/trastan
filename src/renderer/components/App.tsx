import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FC,
} from "react";
import styles from "./App.module.css";
import { marked } from "marked";

export const App: FC = () => {
  const editorRef = useRef<HTMLTextAreaElement | null>(null);
  const [result, setResult] = useState("");
  const [isCopied, setCopied] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const runTranslate = useCallback(
    async (text: string) => {
      if (text === "") return;

      setResult("");
      setLoading(true);
      window.ipcRenderer
        .invoke("translate", text)
        .then((r) => {
          setResult(r);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [setLoading, setResult]
  );

  const handleKeyDown = useCallback(
    async (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
        if (editorRef.current == null) return;
        runTranslate(editorRef.current.value);
      }
    },
    [editorRef]
  );

  const handlePaste = useCallback(
    async (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
      const pastedData = event.clipboardData.getData("text");
      setTimeout(() => {
        if (pastedData === editorRef.current?.value) {
          runTranslate(pastedData);
        }
      });
    },
    [editorRef]
  );

  useEffect(() => {
    window.ipcRenderer.addListener("copy-result", () => {
      if (result === "") return;
      navigator.clipboard.writeText(result).then(() => {
        setCopied(true);
      });
      setTimeout(() => setCopied(false), 1000);
    });
  }, [result, setCopied]);

  const html = useMemo(() => {
    return marked.parse(result) as string;
  }, [result]);

  return (
    <div className={styles.container}>
      {isCopied && <div className={styles.copied}>Copied!</div>}
      <div className={styles.left}>
        <textarea
          className={styles.editor}
          ref={editorRef}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
        />
      </div>
      <div className={styles.right}>
        {isLoading ? (
          <div className={styles.loading}>
            <div className={styles.spinner} />
          </div>
        ) : (
          <div
            className={styles.result}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}
      </div>
    </div>
  );
};
