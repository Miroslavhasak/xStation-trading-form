<<<<<<< HEAD
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    ticker VARCHAR(10) NOT NULL,
    quantity INT NOT NULL,
    limit_price NUMERIC(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING' NOT NULL,
    idempotency_key VARCHAR(50) UNIQUE NOT NULL,
    version INT DEFAULT 0 NOT NULL
=======
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    ticker VARCHAR(10) NOT NULL,
    quantity INT NOT NULL,
    limit_price NUMERIC(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING' NOT NULL,
    idempotency_key VARCHAR(50) UNIQUE NOT NULL,
    version INT DEFAULT 0 NOT NULL
>>>>>>> de8e149c05c5746aeb8f332529654fd1dceee462
)