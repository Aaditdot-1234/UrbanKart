class OTPStore{ 
    private  userOtp = new Map<string, {code:string, expires: Date}>();

    create(email :string, otp: string, expiresIn:Date){
        this.userOtp.set(email.toLowerCase().trim(), {code: otp, expires: expiresIn})
    }

    verify(email:string, submittedOTP: string): boolean{
        const record = this.userOtp.get(email.toLowerCase().trim());

        if(!record) return false;
        if(record.expires < new Date()){
            this.remove(email);
            return false;
        }
        return record.code === submittedOTP;
    }
    remove(email:string){
        this.userOtp.delete(email.toLowerCase().trim());
    }
}   

export const otpStore = new OTPStore();