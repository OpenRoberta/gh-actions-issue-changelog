import {expect, test} from "@jest/globals";
import {parseIssueNumber, getVersion, formatIssue} from "../src/util";

test("parses version number from ORA tag", async () => {
    expect(getVersion({name: "ORA-4.2.1"})).toBe("4.2.1");
    expect(getVersion({name: "O-4.2.1"})).toBe("4.2.1");
    expect(getVersion({name: "4.2.1"})).toBe("4.2.1");
    expect(getVersion({name: "v4.2.1"})).toBe("4.2.1");
});

test("contains issue number accepts and rejects correctly", async () => {
    expect(parseIssueNumber("issue #1081 - the onWrap function return the result of the wrapped function")).toBe(1081);
    expect(parseIssueNumber("issue #1051 prevent multiple click events in the right menu bar")).toBe(1051);
    expect(parseIssueNumber("remove outdated volksbot plugin")).toBe(-1);
});

test("format issue", async () => {
    expect(
        formatIssue({
            title: "Revise / Remove shortcuts from menu",
            number: 1058
        })
    ).toBe("#1058 Revise / Remove shortcuts from menu");
});
