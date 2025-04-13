package handler

import (
	"errors"
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"net/http"

	"gadgetGalaxy/dbquery"
	"gadgetGalaxy/utils"
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

	pass, err := dbquery.SelectAdminPassword(loginReq.Username)

	if err != nil {
		status := http.StatusInternalServerError

		if errors.Is(err, dbquery.NotFoundErr) {
			status = http.StatusNotFound
		}

		c.JSON(status, gin.H{
			"error":   true,
			"message": err.Error(),
		})
		return
	}

	if loginReq.Password != pass {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error":   true,
			"message": "error: invalid credentials",
		})
		return
	}

	session := sessions.Default(c)
	hash, err := utils.Hash(loginReq.Username)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   true,
			"message": err.Error(),
		})
		return
	}

	session.Set("id", hash)

	if err = session.Save(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   true,
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"error":   false,
		"message": "success",
	})
}

func (h *AdminHandler) LogoutHandler(c *gin.Context) {
	session := sessions.Default(c)

	session.Clear()

	if err := session.Save(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   true,
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"error":   false,
		"message": "success",
	})
}
