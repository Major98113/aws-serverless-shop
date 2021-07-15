--DROP TABLE IF EXISTS users;

create table users (
    user_id uuid primary key default uuid_generate_v4(),
    username text not null,
    password text not null
);

insert into users ( username, password ) values
    ( 'Max', 'MTIzNDU2Nzg=' ), --Max 12345678
    ( 'Sacha', 'cXdlcnR5MTIzNA==' ), --Sacha qwerty1234
    ( 'Alex', 'eXRyZXdxNDMyMQ==' ), --Alex ytrewq4321
    ( 'Petya', 'dGVzdDEyMzQ=' ); --Petya test1234