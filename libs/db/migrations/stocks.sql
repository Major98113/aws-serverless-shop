
--DROP TABLE IF EXISTS stocks;

create table stocks (
	product_id uuid,
	count integer,
	foreign key ("product_id") references "products" ("id")
);

insert into stocks ( product_id , count) values
	( '8fcd8e02-c428-4b3f-bd16-810928e19b3b', 4),
	( 'da9739f4-7eeb-41bc-b4c3-cabbadbf0bba', 6),
	( '4d3d469b-82d7-478d-baf0-afc43ff6c560', 7),
	( '8d6ed29e-4118-43af-9e01-d636e28e0269', 12),
	( '350ffcfd-91f8-4dff-8fcd-aad41f964ba5', 7),
	( 'c7675b28-b668-44c4-ba69-a9f9273ad396', 8),
	( 'c59e6618-ddb1-4d72-a1c7-063ef80ab197', 2),
	( '36681ddf-f001-4d85-911b-96c80d430b2c', 3);