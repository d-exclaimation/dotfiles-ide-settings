"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileAnchorProvider = void 0;
const entryAnchor_1 = require("../anchor/entryAnchor");
/**
 * AnchorProvider implementation in charge of returning the anchors in the current file
 */
class FileAnchorProvider {
    constructor(provider) {
        this.onDidChangeTreeData = provider._onDidChangeTreeData.event;
        this.provider = provider;
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        if (element) {
            if (element instanceof entryAnchor_1.default && element.children) {
                return Promise.resolve(element.children);
            }
            return Promise.resolve([]);
        }
        // Return result
        return new Promise((resolve) => {
            if (!this.provider.anchorsLoaded) {
                resolve([this.provider.statusLoading]);
            }
            else if (this.provider._editor == undefined) {
                resolve([this.provider.errorUnusableItem]);
            }
            else if (this.provider.currentAnchors.length == 0) {
                resolve([this.provider.errorEmptyItem]);
            }
            else {
                resolve(entryAnchor_1.default.sortAnchors(this.provider.currentAnchors));
            }
        });
    }
}
exports.FileAnchorProvider = FileAnchorProvider;
//# sourceMappingURL=fileAnchorProvider.js.map