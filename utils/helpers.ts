import {readFileSync} from "fs";
import crypto from 'crypto';

export function randomStr(length: number): string {
    let result = '';
    let characters = 'abcdef0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export function parseUrl(url: string): { hostname: string; path: string } {
    const parsedUrl = new URL(url);
    return {
        hostname: parsedUrl.hostname,
        path: parsedUrl.pathname,
    }
}

export function randomChoice<T>(array: T[]): T {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

export function readFromFile(fileName: string) {
    return readFileSync(fileName, { encoding: 'utf8', flag: 'r' });
}

export function getRandomTlsCiphers(): string {
    const nodeOrderedCipherList = crypto.constants.defaultCipherList.split(':');

    return nodeOrderedCipherList.slice(3)
        .map(cipher => ({ cipher, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ cipher }) => cipher).join(':');
}