type Todo = {
    id: string;
    user_id: string;
    title: string;
    context: string;
    checked: boolean;
};

type TodoWithoutId = Omit<Todo, 'id'>;

type User = {
    id: string;
    username: string;
    password: string;
};

type UserWithoutId = Omit<User, 'id'>;

type ErrorType = {
    msg: string;
    path: string;
    value: string;
};
