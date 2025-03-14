export interface FloatButton {
    action?: string;
    icon?: string;
    label?: string;
    color?: string;
    subActions?: Action[];
}

export interface Action {
    action?: string;
    icon?: string;
    label?: string;
    color?: string;
}
