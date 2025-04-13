package middleware

import (
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"net/http"
)

func Authentication(c *gin.Context) {
	session := sessions.Default(c)
	sessionID := session.Get("id")

	if sessionID == nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error":   true,
			"message": "unauthorized",
		})
		c.Abort()
		return
	}
}
