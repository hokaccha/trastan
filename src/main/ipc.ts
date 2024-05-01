import { ipcMain } from "electron";
import { translate } from "./translate";

export function initIpc() {
  ipcMain.handle("translate", async (_, text) => {
    return translate(text);
  });
}
