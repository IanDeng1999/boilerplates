export APP_NAME=unnamed
export CONTAINER_STORAGE_DIR=$HOME/.data/$APP_NAME
mkdir -p $CONTAINER_STORAGE_DIR/postgres
mkdir -p $CONTAINER_STORAGE_DIR/valkey
cat >| $CONTAINER_STORAGE_DIR/compose.yml << EOF
services:
  postgres:
    image: docker.io/postgres:18.2
    container_name: $APP_NAME-postgres
    restart: always
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=$APP_NAME.pass
    ports:
      - "0.0.0.0:28091:5432"
    volumes:
      - $CONTAINER_STORAGE_DIR/postgres:/var/lib/postgresql
  valkey:
    image: docker.io/valkey/valkey:latest
    restart: always
    container_name: $APP_NAME-valkey
    ports:
      - "0.0.0.0:28092:6379"
    command: valkey-server --requirepass "$APP_NAME.pass"
    volumes:
      - $CONTAINER_STORAGE_DIR/valkey/data:/data
EOF
cd $CONTAINER_STORAGE_DIR
podman compose up -d
podman unshare chown -R 0:0 $CONTAINER_STORAGE_DIR