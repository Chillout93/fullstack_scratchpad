# Use the official PostgreSQL 15 image as the base
FROM postgres:16

# Install necessary dependencies and pgxnclient
RUN apt-get update && apt-get install -y \
    pgxnclient \
    postgresql-server-dev-16 \
    gcc \
    g++ \
    make \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install the PostgreSQL Anonymizer extension using pgxnclient
RUN pgxn install postgresql_anonymizer