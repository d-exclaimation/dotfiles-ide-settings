"use strict";
// Copyright 2018-2021 the Deno authors. All rights reserved. MIT license.
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _panel, _extensionUri, _mediaRoot, _disposables, _update, _getHtmlForWebview;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WelcomePanel = void 0;
const vscode = require("vscode");
const constants_1 = require("./constants");
function getNonce() {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
class WelcomePanel {
    constructor(panel, extensionUri) {
        _panel.set(this, void 0);
        _extensionUri.set(this, void 0);
        _mediaRoot.set(this, void 0);
        _disposables.set(this, []);
        _update.set(this, () => {
            const { webview } = __classPrivateFieldGet(this, _panel);
            __classPrivateFieldGet(this, _panel).webview.html = __classPrivateFieldGet(this, _getHtmlForWebview).call(this, webview);
        });
        _getHtmlForWebview.set(this, (webview) => {
            const scriptPath = vscode.Uri.joinPath(__classPrivateFieldGet(this, _mediaRoot), "welcome.js");
            const stylesPath = vscode.Uri.joinPath(__classPrivateFieldGet(this, _mediaRoot), "welcome.css");
            const logoPath = vscode.Uri.joinPath(__classPrivateFieldGet(this, _extensionUri), "deno.png");
            const denoExtension = vscode.extensions.getExtension(constants_1.EXTENSION_ID);
            const denoExtensionVersion = denoExtension.packageJSON.version;
            const scriptURI = webview.asWebviewUri(scriptPath);
            const stylesURI = webview.asWebviewUri(stylesPath);
            const logoURI = webview.asWebviewUri(logoPath);
            const nonce = getNonce();
            return `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <!--
          Use a CSP that only allows loading images from https or from our
          extension directory and only allows scripts that have a specific nonce
        -->
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; img-src ${webview.cspSource} https:; script-src 'nonce-${nonce}';">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="${stylesURI}" rel="stylesheet">
        <title>Deno for VSCode</title>
      </head>
      <body>
      <main class="Content">
      <div class="Header">
        <img src="${logoURI}" alt="Deno Extension Logo" class="Header-logo" />
        <div class="Header-details">
          <h1 class="Header-title">Deno for VSCode v${denoExtensionVersion}</h1>
          <p>The official Deno extension for Visual Studio Code, powered by the Deno Language Server.</p>
          <ul class="Header-links">
            <li><a href="#" class="Command" data-command="openDocument" data-document="Releases.md">Release notes</a></li>
            <li><a href="https://github.com/denoland/vscode_deno/">GitHub</a></li>
            <li><a href="https://discord.gg/deno">Discord</a></li>
          </ul>
        </div>
      </div>
      
      <div class="Cards">
        <div class="Card">
          <div class="Card-inner">
          <p class="Card-title">Enabling Deno</p>
          <p class="Card-content">
            <p>
              The extension does not assume it applies to all workspaces you use
              with VSCode. You can enable Deno in a workspace by running the
              <em><a href="#" class="Command" data-command="init">Deno:
              Initialize Workspace Configuration</a></em> command.
            </p>
            <p>
              You can also enable or disable it in the
              <a href="#" class="Command" data-command="openSetting" data-setting="deno.enable">settings</a>.
              <em>It is not recommended to enable it globally, unless of course
              you only edit Deno projects with VSCode.</em>
            </p>
          </p>
          </div>
        </div>

        <div class="Card">
          <div class="Card-inner">
            <p class="Card-title">Getting started with Deno</p>
            <p class="Card-content">
              If you are new to Deno, check out the
              <a href="https://deno.land/manual/getting_started">getting started
              section</a> of the Deno manual.
            </p>
          </div>
        </div>
      </div>
      </main>
      
      <script nonce="${nonce}" src="${scriptURI}"></script>
      </body>
      </html>`;
        });
        __classPrivateFieldSet(this, _panel, panel);
        __classPrivateFieldSet(this, _extensionUri, extensionUri);
        __classPrivateFieldSet(this, _mediaRoot, vscode.Uri.joinPath(__classPrivateFieldGet(this, _extensionUri), "media"));
        __classPrivateFieldGet(this, _update).call(this);
        __classPrivateFieldGet(this, _panel).onDidDispose(() => this.dispose(), null, __classPrivateFieldGet(this, _disposables));
        __classPrivateFieldGet(this, _panel).webview.onDidReceiveMessage((message) => {
            switch (message.command) {
                case "openDocument": {
                    const uri = vscode.Uri.joinPath(__classPrivateFieldGet(this, _extensionUri), message.document);
                    vscode.commands.executeCommand("markdown.showPreviewToSide", uri);
                    return;
                }
                case "openSetting": {
                    vscode.commands.executeCommand("workbench.action.openSettings", message.setting);
                    return;
                }
                case "init": {
                    vscode.commands.executeCommand("deno.initializeWorkspace");
                    return;
                }
            }
        }, null, __classPrivateFieldGet(this, _disposables));
    }
    dispose() {
        WelcomePanel.currentPanel = undefined;
        __classPrivateFieldGet(this, _panel).dispose();
        for (const handle of __classPrivateFieldGet(this, _disposables)) {
            if (handle) {
                handle.dispose();
            }
        }
    }
    static createOrShow(extensionUri) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;
        if (WelcomePanel.currentPanel) {
            __classPrivateFieldGet(WelcomePanel.currentPanel, _panel).reveal(column);
            return;
        }
        const panel = vscode.window.createWebviewPanel(WelcomePanel.viewType, "Deno for VSCode", column !== null && column !== void 0 ? column : vscode.ViewColumn.One, {
            enableScripts: true,
            localResourceRoots: [vscode.Uri.joinPath(extensionUri)],
        });
        panel.iconPath = vscode.Uri.joinPath(extensionUri, "deno.png");
        WelcomePanel.currentPanel = new WelcomePanel(panel, extensionUri);
    }
    static revive(panel, extensionUri) {
        WelcomePanel.currentPanel = new WelcomePanel(panel, extensionUri);
    }
}
exports.WelcomePanel = WelcomePanel;
_panel = new WeakMap(), _extensionUri = new WeakMap(), _mediaRoot = new WeakMap(), _disposables = new WeakMap(), _update = new WeakMap(), _getHtmlForWebview = new WeakMap();
WelcomePanel.viewType = "welcomeDeno";
//# sourceMappingURL=welcome.js.map