export const parseResponse = (response: string): string => {
    const regex = /"([^"]*)"/;
    const match = response.match(regex);

    if (!match || match.length < 2) {
        throw new Error('invalid post response');
    }
    return match[1];
};