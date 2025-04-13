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
	UserHandler struct {
	}

	loginRequest struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	updateUserRequest struct {
		Username  string `json:"username"`
		FirstName string `json:"firstName"`
		LastName  string `json:"lastName"`
		Email     string `json:"email"`
		PhoneNum  string `json:"phoneNum"`
	}

	updatePassRequest struct {
		Username    string `json:"username"`
		OldPassword string `json:"oldPassword"`
		NewPassword string `json:"newPassword"`
	}
)

func NewUserHandler() *UserHandler {
	return &UserHandler{}
}

func (h *UserHandler) RegisterHandler(c *gin.Context) {
	var user dbquery.User

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   true,
			"message": err.Error(),
		})
		return
	}

	if _, err := dbquery.RegisterUser(user); err != nil {
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

func (h *UserHandler) LoginHandler(c *gin.Context) {
	var loginReq loginRequest

	if err := c.ShouldBindJSON(&loginReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   true,
			"message": err.Error(),
		})
		return
	}

	pass, err := dbquery.SelectUserPassword(loginReq.Username)

	if err != nil {
		if errors.Is(err, dbquery.NotFoundErr) {
			c.JSON(http.StatusNotFound, gin.H{
				"error":   true,
				"message": err.Error(),
			})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{
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

	session.Set("id", string(hash))

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

func (h *UserHandler) LogoutHandler(c *gin.Context) {
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

func (h *UserHandler) UpdateHandler(c *gin.Context) {
	var updateUserReq updateUserRequest

	if err := c.ShouldBindJSON(&updateUserReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   true,
			"message": err.Error(),
		})
		return
	}

	user, err := dbquery.SelectUserByName(updateUserReq.Username)

	if err != nil {
		if errors.Is(err, dbquery.NotFoundErr) {
			c.JSON(http.StatusNotFound, gin.H{
				"error":   true,
				"message": err.Error(),
			})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   true,
			"message": err.Error(),
		})
		return
	}

	user.FirstName = updateUserReq.FirstName
	user.LastName = updateUserReq.LastName
	user.Email = updateUserReq.Email
	user.PhoneNum = updateUserReq.PhoneNum

	if err = dbquery.UpdateUser(user); err != nil {
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

func (h *UserHandler) NewPassHandler(c *gin.Context) {
	var updatePassReq updatePassRequest

	if err := c.ShouldBindJSON(&updatePassReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   true,
			"message": err.Error(),
		})
		return
	}

	user, err := dbquery.SelectUserByName(updatePassReq.Username)

	if err != nil {
		if errors.Is(err, dbquery.NotFoundErr) {
			c.JSON(http.StatusNotFound, gin.H{
				"error":   true,
				"message": err.Error(),
			})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   true,
			"message": err.Error(),
		})
		return
	}

	if updatePassReq.OldPassword != user.Password {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error":   true,
			"message": "error: invalid credentials",
		})
		return
	}

	if _, err = dbquery.UpdateUserPassword(user.Username, updatePassReq.NewPassword); err != nil {
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
