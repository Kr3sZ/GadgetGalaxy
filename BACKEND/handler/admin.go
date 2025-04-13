package handler

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

type (
	AdminHandler struct {
	}
)

func NewAdminHandler() *AdminHandler {
	return &AdminHandler{}
}

func (h *AdminHandler) LoginHandler(c *gin.Context) {
	var loginReq loginRequest

	if err := c.ShouldBindJSON(&loginReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   true,
			"message": err.Error(),
		})
		return
	}
}
