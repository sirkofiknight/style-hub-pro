-- Make order_number have a default value so it can be omitted during insert
-- The trigger will override it anyway
ALTER TABLE public.orders ALTER COLUMN order_number SET DEFAULT '';