package main

import (
	"fmt"
	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/redis"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"log"
	"net/http"
	"os"
	"time"

	"gadgetGalaxy/dbquery"
	"gadgetGalaxy/handler"
	"gadgetGalaxy/middleware"
	"gadgetGalaxy/utils"
)

func main() {
	// --- Try loading env values from file ---
	fmt.Println("\n-----------------")
	fmt.Println("Loading .env variables...")

	if err := godotenv.Load(); err != nil {
		fmt.Println("Unable to find .env file in go project root, using system environment values.")
	}

	//goland:noinspection GoPrintFunctions
	fmt.Println("Loading successful!\n")
	// ---

	// --- Connect to MariaDB ---
	dbUser := os.Getenv("DB_USER")
	dbPass := os.Getenv("DB_PASS")
	dbAddr := os.Getenv("DB_ADDR")
	dbName := os.Getenv("DB_NAME")

	fmt.Println("Connecting to database...")

	err := dbquery.ConnectToDb(dbUser, dbPass, dbAddr, dbName)

	if err != nil {
		log.Fatalf("error: %s\n", err.Error())
	}

	//goland:noinspection GoPrintFunctions
	fmt.Println("Connection successful!\n")
	// ---

	// --- Setup rest API with default config ---
	fmt.Println("Starting REST API server...")

	// gin.SetMode(gin.ReleaseMode)

	router := gin.Default()
	// ---

	// --- Session management ---
	redisUser := os.Getenv("REDIS_USER")
	redisPass := os.Getenv("REDIS_PASS")
	redisAddr := os.Getenv("REDIS_ADDR")
	redisAuth := os.Getenv("REDIS_AUTH")

	store, err := redis.NewStore(10, "tcp", redisAddr, redisUser, redisPass, []byte(redisAuth))

	if err != nil {
		log.Fatalf("error: %s\n", err.Error())
	}

	router.Use(sessions.Sessions("mySession", store))
	// ---

	// --- CORS ---
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:4200", "http://localhost"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length", "Content-Type", "Content-Disposition", "Content-Transfer-Encoding", "Content-Description"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	router.OPTIONS("/*path", func(c *gin.Context) {
		c.Status(http.StatusOK)
	})
	// ---

	// --- Url groups ---
	api := router.Group("/api")

	apiAuth := api.Group("/auth")
	apiAuth.Use(middleware.Authentication)

	apiAdmin := api.Group("/admin")

	apiAdminAuth := apiAdmin.Group("/auth")
	apiAdminAuth.Use(middleware.AdminAuthentication)
	// ---

	// --- Handler definitions ---
	user := handler.NewUserHandler()
	product := handler.NewProductHandler()
	admin := handler.NewAdminHandler()
	// ---

	// --- Set trusted proxies
	if err = router.SetTrustedProxies([]string{"127.0.0.1"}); err != nil {
		log.Fatalf("error: %s\n", err.Error())
	}
	// ---

	// --- User handling ---
	api.POST("/register", user.RegisterHandler)
	api.POST("/login", user.LoginHandler)

	apiAuth.POST("/editProfile", user.UpdateHandler)
	apiAuth.POST("/newPass", user.NewPassHandler)
	apiAuth.GET("/logout", user.LogoutHandler)
	apiAuth.GET("/userData", user.UserDataHandler)
	// ---

	// --- Product handling ---
	api.GET("/products", product.AllProductsHandler)
	api.POST("/searchProducts", product.SearchProductHandler)
	api.GET("/productImage/:id", product.ProductImageHandler)
	api.GET("/categories", product.AllCategoriesHandler)

	apiAuth.GET("/getCart", product.UserCartHandler)
	apiAuth.POST("/addToCart", product.AddToCartHandler)
	apiAuth.POST("/modifyInCart", product.ModifyAmountInCartHandler)
	apiAuth.POST("/removeFromCart", product.RemoveFromCartHandler)
	apiAuth.POST("/order", product.OrderHandler)
	// ---

	// --- Admin page handling ---
	apiAdmin.POST("/login", admin.LoginHandler)

	apiAdminAuth.GET("/logout", admin.LogoutHandler)
	apiAdminAuth.POST("/addProduct", admin.NewProductHandler)
	apiAdminAuth.DELETE("/removeProduct", admin.RemoveProductHandler)
	// ---

	// --- Test endpoints ---
	api.GET("/hello", func(c *gin.Context) {
		hash, _ := utils.Hash("admin_1744628871")

		c.JSON(http.StatusOK, gin.H{
			"error":   false,
			"message": hash,
		})
	})
	// ---

	if err = router.Run(":8080"); err != nil {
		log.Fatalf("error: %s\n", err.Error())
	}
}
