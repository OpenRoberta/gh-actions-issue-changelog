import {Api, Issue} from "./api";
import * as core from "@actions/core";
import {formatIssue, parseIssueNumber} from "./util";

export async function generateChangelog(api: Api): Promise<string> {
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

    return issues_list
        .filter(issue => issue !== undefined)
        .map(issue => issue as Issue)
        .map(issue => formatIssue(issue))
        .join("\n");
}
