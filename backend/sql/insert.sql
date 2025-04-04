INSERT INTO users (username, password) VALUES ('admin', 'admin');
INSERT INTO users (username, password) VALUES ('user', 'user');

INSERT INTO todos (user_id, title, context, checked) VALUES ((SELECT id from users where username ='admin'), 'todo1', 'posprzatac', false);
INSERT INTO todos (user_id, title, context, checked) VALUES ((SELECT id from users where username ='user'),'todo2', 'wysrac', false);