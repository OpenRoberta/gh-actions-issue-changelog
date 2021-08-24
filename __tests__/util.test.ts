import {expect, describe, it} from "@jest/globals";
import {parseIssueNumber, getVersion, formatIssue} from "../src/util";

describe("parse version number from tag name", () => {
    it("parses version number from tags with hyphen", async () => {
        expect(getVersion({name: "ORA-4.2.1"})).toBe("4.2.1");
        expect(getVersion({name: "O-4.2.1"})).toBe("4.2.1");
    });

    it("parses version number from tags without anything", () => {
        expect(getVersion({name: "4.2.1"})).toBe("4.2.1");
    });

    it("parses version number from tags with v before it", () => {
        expect(getVersion({name: "v4.2.1"})).toBe("4.2.1");
    });
});

describe("parses issue number from commit message", () => {
    it("parses issue number from normal commit message", () => {
        expect(parseIssueNumber("issue #1081 - the onWrap function return the result of the wrapped function")).toBe(1081);
        expect(parseIssueNumber("issue #1051 prevent multiple click events in the right menu bar")).toBe(1051);
    });

    it("doesn't find version number", () => {
        expect(parseIssueNumber("remove outdated volksbot plugin")).toBe(-1);
    });
});

describe("formats issue information correctly", () => {
    it("formats normal issue", async () => {
        expect(
            formatIssue({
                title: "Revise / Remove shortcuts from menu",
                number: 1058
            })
        ).toBe("#1058 Revise / Remove shortcuts from menu");
    });
});
