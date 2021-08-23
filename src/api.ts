import {Context} from "@actions/github/lib/context";
import {GitHub} from "@actions/github/lib/utils";
import compareVersions from "compare-versions";
import {getVersion} from "./util";
import * as core from "@actions/core";

interface Tag {
    name: string;
    commit: {sha: string};
}

interface Commit {
    message: string;
}

export interface Issue {
    title: string;
    number: number;
}

export class Api {
    private git: InstanceType<typeof GitHub>;
    private readonly repo: string;
    private readonly owner: string;

    constructor(git: InstanceType<typeof GitHub>, context: Context) {
        this.git = git;
        this.repo = context.repo.repo;
        this.owner = context.repo.owner;
    }

    async getLastTwoTags(): Promise<Tag[]> {
        const {data: tags} = await this.git.rest.repos.listTags({owner: this.owner, repo: this.repo, per_page: 10});

        const sortedTags = tags
            .filter(tag => compareVersions.validate(getVersion(tag)))
            .sort((a, b) => compareVersions(getVersion(a), getVersion(b)))
            .reverse();

        const currentTag = sortedTags[0];
        const previousTag = sortedTags[1];

        if (sortedTags.length < 2) {
            throw new Error("Too less tags in this repository");
        }

        return [currentTag, previousTag];
    }

    async getCommitsBetweenTags(head: Tag, base: Tag): Promise<Commit[]> {
        const response = await this.git.rest.repos.compareCommits({
            owner: this.owner,
            repo: this.repo,
            base: base.commit.sha,
            head: head.commit.sha
        });
        return response.data.commits.map(commit => commit.commit);
    }

    async getIssue(issue_number: number): Promise<Issue | undefined> {
        try {
            const response = await this.git.rest.issues.get({owner: this.owner, repo: this.repo, issue_number});
            return response.data;
        } catch (e) {
            core.warning(`Cannot find issue #${issue_number}`);
            return undefined;
        }
    }
}
