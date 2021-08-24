import {describe, it, expect} from "@jest/globals";
import {mock, instance, when} from "ts-mockito";
import {Api, Commit, Issue, Tag} from "../src/api";
import {generateChangelog} from "../src/changelog";

describe("creates correct changelog", () => {
    it("creates normal changelog", async () => {
        const api = mock(Api);

        const firstTag: Tag = {name: "", commit: {sha: "0"}};
        const secondTag: Tag = {name: "", commit: {sha: "0"}};

        const firstCommit: Commit = {message: "issue #1084 something"};
        const secondCommit: Commit = {message: "issue #1085 somethingelse"};
        const thirdCommit: Commit = {message: "refactoring"};

        const issue1084: Issue = {title: "Some Title", number: 1084};
        const issue1085: Issue = {title: "Some other Title", number: 1085};

        when(api.getLastTwoTags()).thenResolve([firstTag, secondTag]);
        when(api.getCommitsBetweenTags(firstTag, secondTag)).thenResolve([firstCommit, secondCommit, thirdCommit]);
        when(api.getIssue(1084)).thenResolve(issue1084);
        when(api.getIssue(1085)).thenResolve(issue1085);

        const changelog = await generateChangelog(instance(api));

        expect(changelog).toBe("#1084 Some Title\n#1085 Some other Title");
    });

    it("creates changelog with duplicate issues", async () => {
        const api = mock(Api);

        const firstTag: Tag = {name: "", commit: {sha: "0"}};
        const secondTag: Tag = {name: "", commit: {sha: "0"}};

        const firstCommit: Commit = {message: "issue #1084 something"};
        const secondCommit: Commit = {message: "issue #1084 somethingelse"};
        const thirdCommit: Commit = {message: "refactoring"};

        const issue1084: Issue = {title: "Some Title", number: 1084};

        when(api.getLastTwoTags()).thenResolve([firstTag, secondTag]);
        when(api.getCommitsBetweenTags(firstTag, secondTag)).thenResolve([firstCommit, secondCommit, thirdCommit]);
        when(api.getIssue(1084)).thenResolve(issue1084);

        const changelog = await generateChangelog(instance(api));

        expect(changelog).toBe("#1084 Some Title");
    });

    it("creates changelog with not existing issues", async () => {
        const api = mock(Api);

        const firstTag: Tag = {name: "", commit: {sha: "0"}};
        const secondTag: Tag = {name: "", commit: {sha: "0"}};

        const firstCommit: Commit = {message: "issue #1084 something"};
        const secondCommit: Commit = {message: "issue #1084539 somethingelse"};
        const thirdCommit: Commit = {message: "refactoring"};

        const issue1084: Issue = {title: "Some Title", number: 1084};

        when(api.getLastTwoTags()).thenResolve([firstTag, secondTag]);
        when(api.getCommitsBetweenTags(firstTag, secondTag)).thenResolve([firstCommit, secondCommit, thirdCommit]);
        when(api.getIssue(1084)).thenResolve(issue1084);
        when(api.getIssue(1084539)).thenResolve(undefined);

        const changelog = await generateChangelog(instance(api));

        expect(changelog).toBe("#1084 Some Title");
    });
});
