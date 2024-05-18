import forge from 'node-forge';

export const parseResponse = (response: string): string => {
    const regex = /"([^"]*)"/;
    const match = response.match(regex);

    if (!match || match.length < 2) {
        throw new Error('invalid post response');
    }
    return match[1];
};

export const parseJSONResponse = (response: string): string => {
    let left = 0
    let right = response.length
    while (0 < right && response[right] != "\"") right -= 1
    while (left < response.length && response[left] != "\{") left += 1
    response = response.substring(left, right);
    const content = response.replace(/\\/g, "");
    return content
}

export function encryptMessage(data: string, secretKey: string, iv: string) {
    const input = forge.util.createBuffer(data);
    const cipherAES = forge.cipher.createCipher('AES-CBC', secretKey);
    cipherAES.start({ iv });
    cipherAES.update(input);
    cipherAES.finish();
    const cyphertext = cipherAES.output.getBytes();
    return forge.util.bytesToHex(cyphertext)
}

export function decryptMessage(data: string, secretKey: string, iv: string) {
    const formatInput = forge.util.hexToBytes(data);
    const input = forge.util.createBuffer(formatInput);
    console.log("decryptLogger",{data, secretKey, iv})
    const decipher = forge.cipher.createDecipher('AES-CBC', secretKey);
    decipher.start({ iv });
    decipher.update(input); // input should be a string here
    decipher.finish();
    const decryptedPayload = decipher.output.getBytes();
    return decryptedPayload
}