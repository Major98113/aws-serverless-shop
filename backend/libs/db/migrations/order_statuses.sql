--DROP TABLE IF EXISTS order_statuses;

create table order_statuses (
	order_id uuid NOT NULL,
	status text NOT NULL,
    created_at timestamp without time zone NOT NULL DEFAULT (current_timestamp AT TIME ZONE 'UTC'),
    FOREIGN KEY ( "order_id" ) references "orders" ("id")
);

insert into order_statuses ( order_id, status, created_at ) values
    ( '6d814d3d-b2a3-4416-9d5b-d819a805b490', 'opened', '2021-07-14 10:43:01'),
    ( '87e0f535-4b9d-4703-bd88-b49226e2158d', 'opened', '2021-07-14 10:43:01' ),
    ( '61fd040d-3ade-4aa3-9b17-ced4491b28d3', 'opened', '2021-07-14 10:43:01' ),
    ( 'a5f84e1c-40aa-4b41-98f7-23dda481c079', 'opened', '2021-07-14 10:43:01' ),
    ( '4b1a2592-086d-4278-b9e2-49d6a2fdc036', 'opened', '2021-07-14 10:43:01' ),
    ( '5c4dfa28-34bf-491c-9baa-a8892a1534ae', 'opened', '2021-07-14 10:43:01' ),
    ( '293a974d-2f54-4151-9950-a4054949cb08', 'opened', '2021-07-14 10:43:01' ),
    ( '5fb0f4fc-e802-4c40-968a-05641c53cdf9', 'opened', '2021-07-14 10:43:01' ),
    ( '6d814d3d-b2a3-4416-9d5b-d819a805b490', 'completed', '2021-07-16 12:22:08'),
    ( '87e0f535-4b9d-4703-bd88-b49226e2158d', 'confirmed', '2021-07-14 11:02:59' ),
    ( '61fd040d-3ade-4aa3-9b17-ced4491b28d3', 'completed', '2021-07-15 14:14:00' ),
    ( '4b1a2592-086d-4278-b9e2-49d6a2fdc036', 'approved', '2021-07-14 19:27:40' ),
    ( '5fb0f4fc-e802-4c40-968a-05641c53cdf9', 'cancelled', '2021-07-15 16:30:36' );