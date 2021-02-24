"use strict";
// Copyright 2018-2021 the Deno authors. All rights reserved. MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.welcome = exports.status = exports.showReferences = exports.initializeWorkspace = exports.cache = void 0;
/** Contains handlers for commands that are enabled in Visual Studio Code for
 * the extension. */
const constants_1 = require("./constants");
const initialize_project_1 = require("./initialize_project");
const lsp_extensions_1 = require("./lsp_extensions");
const welcome_1 = require("./welcome");
const vscode = require("vscode");
const vscode_1 = require("vscode");
/** For the current document active in the editor tell the Deno LSP to cache
 * the file and all of its dependencies in the local cache. */
function cache(_context, client) {
    return (uris = []) => {
        const activeEditor = vscode_1.window.activeTextEditor;
        if (!activeEditor) {
            return;
        }
        return vscode_1.window.withProgress({
            location: vscode_1.ProgressLocation.Window,
            title: "caching",
        }, () => {
            return client.sendRequest(lsp_extensions_1.cache, {
                referrer: { uri: activeEditor.document.uri.toString() },
                uris: uris.map((uri) => ({
                    uri,
                })),
            });
        });
    };
}
exports.cache = cache;
function initializeWorkspace(_context, _client) {
    return async () => {
        try {
            const settings = await initialize_project_1.pickInitWorkspace();
            const config = vscode_1.workspace.getConfiguration(constants_1.EXTENSION_NS);
            await config.update("enable", true);
            await config.update("lint", settings.lint);
            await config.update("unstable", settings.unstable);
            await vscode_1.window.showInformationMessage("Deno is now setup in this workspace.");
        }
        catch {
            vscode_1.window.showErrorMessage("Deno project initialization failed.");
        }
    };
}
exports.initializeWorkspace = initializeWorkspace;
function showReferences(_content, client) {
    return (uri, position, locations) => {
        vscode_1.commands.executeCommand("editor.action.showReferences", vscode_1.Uri.parse(uri), client.protocol2CodeConverter.asPosition(position), locations.map(client.protocol2CodeConverter.asLocation));
    };
}
exports.showReferences = showReferences;
/** Open and display the "virtual document" which provides the status of the
 * Deno Language Server. */
function status(_context, _client) {
    return () => {
        const uri = vscode_1.Uri.parse("deno:/status.md");
        return vscode.commands.executeCommand("markdown.showPreviewToSide", uri);
    };
}
exports.status = status;
function welcome(context, _client) {
    return () => {
        welcome_1.WelcomePanel.createOrShow(context.extensionUri);
    };
}
exports.welcome = welcome;
//# sourceMappingURL=commands.js.map