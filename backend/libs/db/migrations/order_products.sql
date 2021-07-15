--DROP TABLE IF EXISTS order_products;

create table order_products (
	order_id uuid NOT NULL,
	product_id uuid NOT NULL,
	count integer NOT NULL,
    FOREIGN KEY ("order_id") references "orders" ("id"),
    FOREIGN KEY ("product_id") references "products" ("id"),
    PRIMARY KEY ( order_id, product_id )
);

insert into order_products ( order_id, product_id, count ) values
    ( '5fb0f4fc-e802-4c40-968a-05641c53cdf9', '8fcd8e02-c428-4b3f-bd16-810928e19b3b', 1 ),
    ( '5c4dfa28-34bf-491c-9baa-a8892a1534ae', 'c59e6618-ddb1-4d72-a1c7-063ef80ab197', 5 ),
    ( '4b1a2592-086d-4278-b9e2-49d6a2fdc036', '8fcd8e02-c428-4b3f-bd16-810928e19b3b', 6 ),
    ( '6d814d3d-b2a3-4416-9d5b-d819a805b490', '8d6ed29e-4118-43af-9e01-d636e28e0269', 3 ),
    ( '87e0f535-4b9d-4703-bd88-b49226e2158d', '350ffcfd-91f8-4dff-8fcd-aad41f964ba5', 2 ),
    ( 'a5f84e1c-40aa-4b41-98f7-23dda481c079', 'da9739f4-7eeb-41bc-b4c3-cabbadbf0bba', 4 ),
    ( '61fd040d-3ade-4aa3-9b17-ced4491b28d3', 'c7675b28-b668-44c4-ba69-a9f9273ad396', 10 ),
    ( '293a974d-2f54-4151-9950-a4054949cb08', '4d3d469b-82d7-478d-baf0-afc43ff6c560', 5 ),
    ( '5fb0f4fc-e802-4c40-968a-05641c53cdf9', 'c59e6618-ddb1-4d72-a1c7-063ef80ab197', 11 ),
    ( '5c4dfa28-34bf-491c-9baa-a8892a1534ae', '4d3d469b-82d7-478d-baf0-afc43ff6c560', 4 ),
    ( '4b1a2592-086d-4278-b9e2-49d6a2fdc036', '36681ddf-f001-4d85-911b-96c80d430b2c', 7 ),
    ( '6d814d3d-b2a3-4416-9d5b-d819a805b490', '8fcd8e02-c428-4b3f-bd16-810928e19b3b', 6 ),
    ( '87e0f535-4b9d-4703-bd88-b49226e2158d', '4d3d469b-82d7-478d-baf0-afc43ff6c560', 1 ),
    ( '293a974d-2f54-4151-9950-a4054949cb08', 'da9739f4-7eeb-41bc-b4c3-cabbadbf0bba', 8 );