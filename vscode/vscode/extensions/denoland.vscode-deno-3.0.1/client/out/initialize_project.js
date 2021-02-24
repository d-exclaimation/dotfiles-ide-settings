"use strict";
// Copyright 2018-2021 the Deno authors. All rights reserved. MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.pickInitWorkspace = void 0;
const multi_step_input_1 = require("./multi_step_input");
const quickPickYesNo = [
    { label: "Yes" },
    { label: "No" },
];
function pickInitWorkspace() {
    const title = "Initialize Project";
    async function pickLint(input, state) {
        const pick = await input.showQuickPick({
            title,
            step: 1,
            totalSteps: 2,
            placeholder: "Enable Deno linting?",
            items: quickPickYesNo,
            shouldResume: () => Promise.resolve(false),
        });
        state.lint = pick.label === "Yes" ? true : false;
        return (input) => pickUnstable(input, state);
    }
    async function pickUnstable(input, state) {
        const pick = await input.showQuickPick({
            title,
            step: 2,
            totalSteps: 2,
            placeholder: "Enable Deno unstable APIs?",
            items: quickPickYesNo,
            shouldResume: () => Promise.resolve(false),
        });
        state.unstable = pick.label === "Yes" ? true : false;
    }
    async function collectInputs() {
        const state = {};
        await multi_step_input_1.MultiStepInput.run((input) => pickLint(input, state));
        return state;
    }
    return collectInputs();
}
exports.pickInitWorkspace = pickInitWorkspace;
//# sourceMappingURL=initialize_project.js.map