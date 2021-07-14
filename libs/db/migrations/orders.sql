--DROP TABLE IF EXISTS orders;

create table orders (
	id uuid primary key default uuid_generate_v4(),
	status text not null,
	created_at timestamp without time zone NOT NULL DEFAULT (current_timestamp AT TIME ZONE 'UTC'),
    updated_at timestamp without time zone NOT NULL DEFAULT (current_timestamp AT TIME ZONE 'UTC')
);

insert into orders ( status ) values
    ( 'open' ),
    ( 'completed' ),
    ( 'cancelled' ),
    ( 'open' ),
    ( 'approved' ),
    ( 'confirmed' ),
    ( 'open' ),
    ( 'completed' );