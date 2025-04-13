# Every single address needs to use the Docker service for container communication
# The host machine itself can reach everything on localhost by default
# Every port needs to correlate to the docker and the environment variable ports

# MySQL
MYSQL_ROOT_PASSWORD=""
MYSQL_DATABASE=""              # gadget_galaxy
MYSQL_USER=""
MYSQL_PASSWORD=""

# Backend
DB_USER=""
DB_PASS=""
DB_ADDR=""                     # mysql:port
DB_NAME=""                     # gadget_galaxy

# Redis
REDIS_ADDR=""                  # redis:port
REDIS_USER=""                  # optional, can be empty by default 
REDIS_PASS=""                  # optional, can be empty by default
REDIS_AUTH=""                  # variable, its for the purpose of viewing the stored session
