"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpStore = void 0;
class OTPStore {
    constructor() {
        this.userOtp = new Map();
    }
    create(email, otp, expiresIn) {
        this.userOtp.set(email.toLowerCase().trim(), { code: otp, expires: expiresIn });
    }
    verify(email, submittedOTP) {
        const record = this.userOtp.get(email.toLowerCase().trim());
        if (!record)
            return false;
        if (record.expires < new Date()) {
            this.remove(email);
            return false;
        }
        return record.code === submittedOTP;
    }
    remove(email) {
        this.userOtp.delete(email.toLowerCase().trim());
    }
}
exports.otpStore = new OTPStore();
