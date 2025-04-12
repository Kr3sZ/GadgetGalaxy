package main

import (
	"fmt"
	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/redis"
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
	//"github.com/joho/godotenv"
	"log"
	"net/http"
	"os"
	"strings"

	"gadgetGalaxy/dbquery"
	"gadgetGalaxy/handler"
	"gadgetGalaxy/middleware"
)

func main() {
	fmt.Println("Loading .env variables...")

	/*
		if err := godotenv.Load(); err != nil {
			log.Fatalf("error: %s\n", err.Error())
		}
	*/
	dbUser := os.Getenv("DB_USER")
	dbPass := os.Getenv("DB_PASS")
	dbAddr := os.Getenv("DB_ADDR")
	dbName := os.Getenv("DB_NAME")

	//goland:noinspection GoPrintFunctions
	fmt.Println("Loading successful!\n")
	fmt.Println("Connecting to database...")
	fmt.Println(dbUser, dbPass, dbAddr, dbName)

	err := dbquery.ConnectToDb(dbUser, dbPass, dbAddr, dbName)

	if err != nil {
		log.Fatalf("error: %s\n", err.Error())
	}

	//goland:noinspection GoPrintFunctions
	fmt.Println("Connection successful!\n")
	fmt.Println("Starting REST API server...")

	// gin.SetMode(gin.ReleaseMode)

	router := gin.Default()
	store, err := redis.NewStore(10, "tcp", "127.0.0.1:6379", "", "", []byte("secret"))

	if err != nil {
		log.Fatalf("error: %s\n", err.Error())
	}

	router.Use(sessions.Sessions("mySession", store))

	// -- Url groups
	api := router.Group("/api")

	apiAuth := api.Group("/auth")
	apiAuth.Use(middleware.Authentication())
	// ---

	// --- Handler definitions ---
	user := handler.NewUserHandler()
	product := handler.NewProductHandler()
	// ---

	// --- Set trusted proxies
	if err = router.SetTrustedProxies([]string{"127.0.0.1"}); err != nil {
		log.Fatalf("error: %s\n", err.Error())
	}
	// ---

	// --- Admin pages ---
	router.Use(addPage("/admin", "./public/pages/admin"))
	// ---

	// --- User handling ---
	api.POST("/register", user.RegisterHandler)
	api.POST("/login", user.LoginHandler)

	apiAuth.POST("/editProfile", user.UpdateHandler)
	apiAuth.POST("/newPass", user.NewPassHandler)
	apiAuth.GET("/logout", user.LogoutHandler)
	// ---

	// --- Product handling ---
	api.GET("/products", product.AllProductsHandler)
	api.POST("/searchProducts", product.SearchProductHandler)
	// ---

	// --- Test endpoints ---
	api.GET("/hello", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"error":   false,
			"message": strings.Contains("asd asd", ""),
		})
	})
	// ---

	if err = router.Run(":8080"); err != nil {
		log.Fatalf("error: %s\n", err.Error())
	}
}

func addPage(urlPrefix string, root string) gin.HandlerFunc {
	return static.Serve(urlPrefix, static.LocalFile(root, true))
}
