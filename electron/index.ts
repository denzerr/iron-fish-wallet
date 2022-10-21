import { app, BrowserWindow, ipcMain, nativeTheme, shell } from 'electron'
import {
  IronfishAccountManagerAction,
  IronfishManagerAction,
} from 'Types/IIronfishManager'
import initStorageCallbacks from './initStorage'
import { IronFishManager } from './ironfish/IronFishManager'

// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const WALLET_WEBPACK_ENTRY: string
declare const WALLET_PRELOAD_WEBPACK_ENTRY: string

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit()
}

let mainWindow: BrowserWindow
const ironfishManager = new IronFishManager()

async function shutdownNode() {
  return await ironfishManager.stop()
}

const createWindow = () => {
  if (!mainWindow) {
    initStorageCallbacks(ipcMain)

    // Create the browser window.
    mainWindow = new BrowserWindow({
      minHeight: 700,
      minWidth: 750,
      autoHideMenuBar: true,
      icon: __dirname + '/app.ico',
      title: 'Iron Fish Wallet',
      webPreferences: {
        contextIsolation: true,
        // nodeIntegrationInWorker: true,
        preload: WALLET_PRELOAD_WEBPACK_ENTRY,
      },
    })

    ipcMain.handle(
      'theme-mode-change',
      (e, mode: 'light' | 'dark' | 'system') => {
        nativeTheme.themeSource = mode
      }
    )

    ipcMain.handle(
      'ironfish-manager',
      (e, action: IronfishManagerAction, ...args): Promise<any> =>
        ironfishManager[action](...(args as []))
    )

    ipcMain.handle(
      'ironfish-manager-accounts',
      (e, action: IronfishAccountManagerAction, ...args): Promise<any> =>
        ironfishManager.accounts[action](...(args as [any]))
    )

    mainWindow.maximize()

    if (process.env.APP_DEV === 'true') {
      // Open the DevTools.
      mainWindow.webContents.openDevTools()
    }

    // and load the index.html of the app.
    mainWindow.loadURL(WALLET_WEBPACK_ENTRY)

    mainWindow.webContents.on('new-window', (e, url) => {
      e.preventDefault()
      shell.openExternal(url)
    })
  } else {
    mainWindow.show()
    mainWindow.focus()
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => createWindow())

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', async () => {
  shutdownNode()
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

process.on('exit', shutdownNode)
process.on('SIGINT', shutdownNode)
process.on('SIGUSR1', shutdownNode)
process.on('SIGUSR2', shutdownNode)

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
