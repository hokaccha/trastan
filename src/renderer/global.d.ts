import type { IpcRenderer } from "electron";

declare global {
  interface Window {
    ipcRenderer: IpcRenderer;
    env: Record<string, string | undefined>;
  }
}
