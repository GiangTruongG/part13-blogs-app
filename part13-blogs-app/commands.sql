insert into blogs (author, url, title, likes) values ('Nick', 'http://nickle.com.au','This is the second blog', 10);

insert into blogs (author, url, title) values ('Jason', 'http://jasonbui.com.au','This is the first blog');

CREATE TABLE blogs (id SERIAL PRIMARY KEY, author text, url text NOT NULL, title text NOT NULL, likes integer DEFAULT 0);
