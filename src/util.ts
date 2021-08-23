export function getVersion(tag: {name: string}): string {
    if (!tag.name.includes("-")) {
        return tag.name.replace("v", "");
    }
    return tag.name.split("-")[1];
}

export function parseIssueNumber(commitMessage: string): number {
    const regex = /issue #(\d+)/;
    const matches = commitMessage.match(regex);
    if (!matches?.length) {
        return -1;
    }
    return parseInt(matches[1]);
}

export function formatIssue(issue: {number: number; title: string}): string {
    return `#${issue.number} ${issue.title}`;
}
