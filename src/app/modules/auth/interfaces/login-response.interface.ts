export interface LoginResponse {
    user:       User;
    token:      string;
}

export interface User {
    id:         number;
    email:      string;
    userName:   string;
    isActive:   boolean;
    createAt:   Date;
    createTime: string;
    updateAt:   Date;
    updateTime: string;
}

