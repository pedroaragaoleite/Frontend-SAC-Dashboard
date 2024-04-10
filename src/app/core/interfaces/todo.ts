import { User } from "./user";

export interface Todo {
    id_todo?: number,
    title: string,
    assigned_date: Date,
    due_date: Date,
    status: string,
    priority: string,
    user_id: number,
    customer_id: number,
    users?: User[]
}
