import * as core from "@actions/core";
import {context, getOctokit} from "@actions/github";
import {Api} from "./api";
import {generateChangelog} from "./changelog";

async function run(): Promise<void> {
    try {
        const token: string = process.env.GITHUB_TOKEN || core.getInput("token") || "";
        const octokit = getOctokit(token);
        const api = new Api(octokit, context);

        const changelog = await generateChangelog(api);

        core.setOutput("changelog", changelog);
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
