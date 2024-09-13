export class ProxyNotFoundError extends Error {
    constructor(message?: string) {
        super(message || "Failed to find a working proxy");
        this.name = "ProxyNotFoundError";
    }
}