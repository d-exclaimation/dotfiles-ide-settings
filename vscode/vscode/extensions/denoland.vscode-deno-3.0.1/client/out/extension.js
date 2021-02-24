"use strict";
// Copyright 2018-2021 the Deno authors. All rights reserved. MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const commands = require("./commands");
const constants_1 = require("./constants");
const content_provider_1 = require("./content_provider");
const vscode = require("vscode");
const node_1 = require("vscode-languageclient/node");
/** Assert that the condition is "truthy", otherwise throw. */
function assert(cond, msg = "Assertion failed.") {
    if (!cond) {
        throw new Error(msg);
    }
}
async function getTsApi() {
    const extension = vscode
        .extensions.getExtension(constants_1.TS_LANGUAGE_FEATURES_EXTENSION);
    const errorMessage = "The Deno extension cannot load the built in TypeScript Language Features. Please try restarting Visual Studio Code.";
    assert(extension, errorMessage);
    const languageFeatures = await extension.activate();
    const api = languageFeatures.getAPI(0);
    assert(api, errorMessage);
    return api;
}
const settingsKeys = [
    "codeLens",
    "config",
    "enable",
    "importMap",
    "lint",
    "unstable",
];
function getSettings() {
    var _a, _b;
    const settings = vscode.workspace.getConfiguration(constants_1.EXTENSION_NS);
    const result = Object.create(null);
    for (const key of settingsKeys) {
        const value = settings.inspect(key);
        assert(value);
        result[key] = (_b = (_a = value.workspaceValue) !== null && _a !== void 0 ? _a : value.globalValue) !== null && _b !== void 0 ? _b : value.defaultValue;
    }
    return result;
}
let client;
let tsApi;
let statusBarItem;
/** When the extension activates, this function is called with the extension
 * context, and the extension bootstraps itself. */
async function activate(context) {
    var _a, _b, _c, _d, _e;
    const run = {
        command: "deno",
        args: ["lsp"],
        // deno-lint-ignore no-undef
        options: { env: { ...process.env, "NO_COLOR": true } },
    };
    const debug = {
        command: "deno",
        // disabled for now, as this gets super chatty during development
        // args: ["lsp", "-L", "debug"],
        args: ["lsp"],
        // deno-lint-ignore no-undef
        options: { env: { ...process.env, "NO_COLOR": true } },
    };
    const serverOptions = { run, debug };
    const clientOptions = {
        documentSelector: [
            { scheme: "file", language: "javascript" },
            { scheme: "file", language: "javascriptreact" },
            { scheme: "file", language: "typescript" },
            { scheme: "file", language: "typescriptreact" },
            { scheme: "deno", language: "javascript" },
            { scheme: "deno", language: "javascriptreact" },
            { scheme: "deno", language: "typescript" },
            { scheme: "deno", language: "typescriptreact" },
        ],
        diagnosticCollectionName: "deno",
        initializationOptions: getSettings(),
    };
    client = new node_1.LanguageClient("deno-language-server", "Deno Language Server", serverOptions, clientOptions);
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 0);
    context.subscriptions.push(statusBarItem);
    context.subscriptions.push(
    // Send a notification to the language server when the configuration changes
    vscode.workspace.onDidChangeConfiguration((evt) => {
        if (evt.affectsConfiguration(constants_1.EXTENSION_NS)) {
            client.sendNotification("workspace/didChangeConfiguration", 
            // We actually set this to empty because the language server will
            // call back and get the configuration. There can be issues with the
            // information on the event not being reliable.
            { settings: null });
            tsApi.configurePlugin(constants_1.EXTENSION_TS_PLUGIN, getSettings());
        }
    }), 
    // Register a content provider for Deno resolved read-only files.
    vscode.workspace.registerTextDocumentContentProvider(content_provider_1.SCHEME, new content_provider_1.DenoTextDocumentContentProvider(client)));
    // Register any commands.
    const registerCommand = createRegisterCommand(context);
    registerCommand("cache", commands.cache);
    registerCommand("initializeWorkspace", commands.initializeWorkspace);
    registerCommand("showReferences", commands.showReferences);
    registerCommand("status", commands.status);
    registerCommand("welcome", commands.welcome);
    context.subscriptions.push(client.start());
    tsApi = await getTsApi();
    await client.onReady();
    const serverVersion = ((_c = (_b = (_a = client.initializeResult) === null || _a === void 0 ? void 0 : _a.serverInfo) === null || _b === void 0 ? void 0 : _b.version) !== null && _c !== void 0 ? _c : "").split(" ")[0];
    statusBarItem.text = `Deno ${serverVersion}`;
    statusBarItem.tooltip = (_e = (_d = client.initializeResult) === null || _d === void 0 ? void 0 : _d.serverInfo) === null || _e === void 0 ? void 0 : _e.version;
    statusBarItem.show();
    tsApi.configurePlugin(constants_1.EXTENSION_TS_PLUGIN, getSettings());
    showWelcomePage(context);
}
exports.activate = activate;
function deactivate() {
    if (!client) {
        return undefined;
    }
    return client.stop();
}
exports.deactivate = deactivate;
function showWelcomePage(context) {
    var _a;
    const welcomeShown = (_a = context.globalState.get("deno.welcomeShown")) !== null && _a !== void 0 ? _a : false;
    if (!welcomeShown) {
        commands.welcome(context, client)();
        context.globalState.update("deno.welcomeShown", true);
    }
}
/** Internal function factory that returns a registerCommand function that is
 * bound to the extension context. */
function createRegisterCommand(context) {
    return function registerCommand(name, factory) {
        const fullName = `${constants_1.EXTENSION_NS}.${name}`;
        const command = factory(context, client);
        context.subscriptions.push(vscode.commands.registerCommand(fullName, command));
    };
}
//# sourceMappingURL=extension.js.map