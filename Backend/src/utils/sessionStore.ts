export interface SessionInfo {
    userId: string,
    userName: string,
    createdAt: Date,
    userAgent: string,
    ip: string,
}

export interface SessionEntry extends SessionInfo {
    jti: string;
}


class SessionStore {
    private sessions = new Map<string, SessionInfo>();
    private userIndex = new Map<string, Set<string>>();

    create(jti: string, info: SessionInfo) {
        this.sessions.set(jti, info);

        let userSessions = this.userIndex.get(info.userId);
        if (!userSessions) {
            userSessions = new Set();
            this.userIndex.set(info.userId, userSessions);
        }

        userSessions.add(jti);
    }

    get(jti: string): SessionInfo | undefined {
        return this.sessions.get(jti);
    }

    delete(jti: string) {
        const session = this.sessions.get(jti);
        if (!session) return;

        this.sessions.delete(jti);

        const userSession = this.userIndex.get(session.userId);
        if (!userSession) return;

        userSession.delete(jti);

        if (userSession.size === 0) {
            this.userIndex.delete(session.userId);
        }
    }

    getForUser(userId: string): SessionEntry[] {
        const userSessions = this.userIndex.get(userId);
        if (!userSessions) return [];

        const result: SessionEntry[] = [];
        for (const jti of userSessions) {
            const info = this.sessions.get(jti);
            if (info) {
                result.push({ jti, ...info });
            }
        }

        return result;
    }

    deleteAllForUser(userId: string): void {
        const userSessions = this.userIndex.get(userId);
        if (!userSessions) return;

        for (const jti of userSessions) {
            this.sessions.delete(jti);
        }

        this.userIndex.delete(userId);
    }
}

export const sessionStore = new SessionStore();