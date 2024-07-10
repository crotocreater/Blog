CREATE TABLE postscontent(
	id serial primary key,
	title text not null, 
	contentposts text not null, 
	atthor text not null, 
	postsdate date
);

create table useraccount (
	id serial  not null,
	username text not null primary key,
	passwork text not null,
	email text not null
);