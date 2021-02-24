"use strict";
// Copyright 2018-2021 the Deno authors. All rights reserved. MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.DenoTextDocumentContentProvider = exports.SCHEME = void 0;
const lsp_extensions_1 = require("./lsp_extensions");
exports.SCHEME = "deno";
class DenoTextDocumentContentProvider {
    constructor(client) {
        this.client = client;
    }
    provideTextDocumentContent(uri, token) {
        return this.client.sendRequest(lsp_extensions_1.virtualTextDocument, { textDocument: { uri: uri.toString() } }, token);
    }
}
exports.DenoTextDocumentContentProvider = DenoTextDocumentContentProvider;
//# sourceMappingURL=content_provider.js.map