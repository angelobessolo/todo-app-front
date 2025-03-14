export interface ResponseTasks {
    statusCode: number;
    message:    string;
    data:       Data;
}

export interface Data {
    tasks: Task[];
}

export interface Task {
    id:          number;
    title:       string;
    description: string;
    status:      string;
    createAt:    Date;
    createTime:  string;
    updateAt:    Date;
    updateTime:  string;
    user:        User;
}

export interface User {
    id:         number;
    email:      string;
    password:   string;
    userName:   string;
    isActive:   boolean;
    createAt:   Date;
    createTime: string;
    updateAt:   Date;
    updateTime: string;
}

export interface DocumentData {
    title:       string;
    Description: string;
    status:      string;
}
