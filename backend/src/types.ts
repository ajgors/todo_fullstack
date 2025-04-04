type Todo = {
    id: string;
    user_id: string;
    title: string;
    context: string;
    checked: boolean;
};

type PostTodo = Omit<Omit<Todo, 'id'>, 'user_id'>;

type User = {
    id: string;
    username: string;
    password: string;
};

type PostUser = Omit<User, 'id'>;

type ErrorType = {
    msg: string;
    path: string;
    value: string;
};
