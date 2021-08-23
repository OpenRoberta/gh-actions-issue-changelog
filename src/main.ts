import * as core from "@actions/core";
import {context, getOctokit} from "@actions/github";
import {formatIssue, parseIssueNumber} from "./util";
import {Api, Issue} from "./api";

async function run(): Promise<void> {
    try {
        const token: string = process.env.GITHUB_TOKEN || core.getInput("token") || "";
        const octokit = getOctokit(token);
        const api = new Api(octokit, context);

        const [currentTag, previousTag] = await api.getLastTwoTags();

        core.info(`Building changelog from ${previousTag.name} to ${currentTag.name}`);

        const commits = await api.getCommitsBetweenTags(currentTag, previousTag);

        const issueNumberList = new Set(
            commits
                .map(commit => commit.message)
                .map(msg => parseIssueNumber(msg))
                .filter(issue => issue >= 0)
        );

        core.info(`Found issues [${Array.from(issueNumberList).join(",")}]`);
        core.info(`Catching corresponding titles ...`);

        const issues_list = await Promise.all(Array.from(issueNumberList).map(async issue => await api.getIssue(issue)));

        const changelog = issues_list
            .filter(issue => issue !== undefined)
            .map(issue => issue as Issue)
            .map(issue => formatIssue(issue))
            .join("\n");

        core.setOutput("changelog", changelog);
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
