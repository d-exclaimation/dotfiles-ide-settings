"use strict";
// Copyright 2018-2021 the Deno authors. All rights reserved. MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.virtualTextDocument = exports.cache = void 0;
/** Contains extensions to the Language Server Protocol that are supported by
 * the Deno Language Server.
 *
 * The requests and notifications types should mirror the Deno's CLI
 * `cli/lsp/language_server.rs` under the method `request_else`.
 */
const vscode_languageclient_1 = require("vscode-languageclient");
exports.cache = new vscode_languageclient_1.RequestType("deno/cache");
exports.virtualTextDocument = new vscode_languageclient_1.RequestType("deno/virtualTextDocument");
//# sourceMappingURL=lsp_extensions.js.map