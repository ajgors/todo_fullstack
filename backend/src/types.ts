export type Todo = {
    id: string;
    user_id: string;
    title: string;
    context: string;
    checked: boolean;
};

export type PostTodo = Omit<Omit<Todo, 'id'>, 'user_id'>;

export type User = {
    id: string;
    username: string;
    password: string;
};

export type PostUser = Omit<User, 'id'>;

export type ErrorType = {
    msg: string;
    path: string;
    value: string;
};
