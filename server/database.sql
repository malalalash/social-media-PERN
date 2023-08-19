CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    avatar VARCHAR(255) DEFAULT "https://cdn-icons-png.flaticon.com/512/149/149071.png?w=826&t=st=1689697261~exp=1689697861~hmac=05e05cd9f1a3d3696b01dcf31e5b881d2a0171110d518065fbe1b1c3f43e7aec"
)


CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  description VARCHAR(255) NOT NULL,
  img VARCHAR(255),
  user_id INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE TABLE likes (
id SERIAL PRIMARY KEY,
post_id INTEGER NOT NULL,
user_id INTEGER NOT NULL,
CONSTRAINT fk_post
	FOREIGN KEY (post_id)
	REFERENCES posts(id)
	ON DELETE CASCADE,
CONSTRAINT fk_user
	FOREIGN KEY (user_id)
	REFERENCES users(id)
	ON DELETE CASCADE,
UNIQUE (post_id, user_id)
);

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    content TEXT,
    user_id INTEGER NOT NULL,
    post_id INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT fk_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,
    CONSTRAINT fk_post 
    FOREIGN KEY (post_id)
    REFERENCES posts(id)
    ON DELETE CASCADE
)