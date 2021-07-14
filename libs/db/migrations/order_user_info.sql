--DROP TABLE IF EXISTS order_user_info;

create table order_user_info (
	order_id uuid NOT NULL,
	address text NOT NULL,
    comment text NOT NULL,
    firstName text NOT NULL,
    lastName text NOT NULL,
    FOREIGN KEY ( "order_id" ) references "orders" ("id"),
    PRIMARY KEY ( order_id )
);

insert into order_user_info ( order_id, address, comment, firstName, lastName ) values
    ( '6d814d3d-b2a3-4416-9d5b-d819a805b490', 'SPB, street 14', 'Test comment 1', 'Maksim', 'Major' ),
    ( '87e0f535-4b9d-4703-bd88-b49226e2158d', 'Moscow, street 1', 'Test comment 2', 'Michael', 'Sergeev' ),
    ( '61fd040d-3ade-4aa3-9b17-ced4491b28d3', 'New-York, street 23', 'Test comment 3', 'Anna', 'Mclelan' ),
    ( 'a5f84e1c-40aa-4b41-98f7-23dda481c079', 'Chicago, street 89', 'Test comment 4', 'Rally', 'Rise' ),
    ( '4b1a2592-086d-4278-b9e2-49d6a2fdc036', 'Los-Angeles, street 2', 'Test comment 5', 'John', 'Dow' ),
    ( '5c4dfa28-34bf-491c-9baa-a8892a1534ae', 'Paris, street 43', 'Test comment 6', 'Paulo', 'Stefanno' ),
    ( '293a974d-2f54-4151-9950-a4054949cb08', 'Tokyo, street 100', 'Test comment 7', 'Nakashima', 'Kira' ),
    ( '5fb0f4fc-e802-4c40-968a-05641c53cdf9', 'Kiev, street 90', 'Test comment 8', 'Andrey', 'Losev' );