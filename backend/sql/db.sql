CREATE TABLE todo (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  context TEXT NOT NULL,
  checked BOOLEAN DEFAULT FALSE
);

