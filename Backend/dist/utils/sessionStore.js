"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionStore = void 0;
class SessionStore {
    constructor() {
        this.sessions = new Map();
        this.userIndex = new Map();
    }
    create(jti, info) {
        this.sessions.set(jti, info);
        let userSessions = this.userIndex.get(info.userId);
        if (!userSessions) {
            userSessions = new Set();
            this.userIndex.set(info.userId, userSessions);
        }
        userSessions.add(jti);
    }
    get(jti) {
        return this.sessions.get(jti);
    }
    delete(jti) {
        const session = this.sessions.get(jti);
        if (!session)
            return;
        this.sessions.delete(jti);
        const userSession = this.userIndex.get(session.userId);
        if (!userSession)
            return;
        userSession.delete(jti);
        if (userSession.size === 0) {
            this.userIndex.delete(session.userId);
        }
    }
    getForUser(userId) {
        const userSessions = this.userIndex.get(userId);
        if (!userSessions)
            return [];
        const result = [];
        for (const jti of userSessions) {
            const info = this.sessions.get(jti);
            if (info) {
                result.push({ jti, ...info });
            }
        }
        return result;
    }
    deleteAllForUser(userId) {
        const userSessions = this.userIndex.get(userId);
        if (!userSessions)
            return;
        for (const jti of userSessions) {
            this.sessions.delete(jti);
        }
        this.userIndex.delete(userId);
    }
}
exports.sessionStore = new SessionStore();
