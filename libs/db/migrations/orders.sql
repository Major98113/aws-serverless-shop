--DROP TABLE IF EXISTS orders;

create table orders (
	id uuid primary key default uuid_generate_v4(),
	status text not null,
	created_at timestamp without time zone NOT NULL DEFAULT (current_timestamp AT TIME ZONE 'UTC'),
    updated_at timestamp without time zone NOT NULL DEFAULT (current_timestamp AT TIME ZONE 'UTC')
);

insert into orders ( id, status ) values
    ( '6d814d3d-b2a3-4416-9d5b-d819a805b490', 'open' ),
    ( '87e0f535-4b9d-4703-bd88-b49226e2158d', 'completed' ),
    ( '61fd040d-3ade-4aa3-9b17-ced4491b28d3', 'cancelled' ),
    ( 'a5f84e1c-40aa-4b41-98f7-23dda481c079', 'open' ),
    ( '4b1a2592-086d-4278-b9e2-49d6a2fdc036', 'approved' ),
    ( '5c4dfa28-34bf-491c-9baa-a8892a1534ae', 'confirmed' ),
    ( '293a974d-2f54-4151-9950-a4054949cb08', 'open' ),
    ( '5fb0f4fc-e802-4c40-968a-05641c53cdf9', 'completed' );