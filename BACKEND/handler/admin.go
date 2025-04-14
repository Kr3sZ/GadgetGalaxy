package handler

import (
	json2 "encoding/json"
	"errors"
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"mime/multipart"
	"net/http"

	"gadgetGalaxy/dbquery"
)

type (
	AdminHandler struct {
	}

	removeProductRequest struct {
		Id int64 `json:"id"`
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
	token, err := dbquery.SelectAdminToken(loginReq.Username)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   true,
			"message": err.Error(),
		})
		return
	}

	session.Set("id", token)

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

func (h *AdminHandler) NewProductHandler(c *gin.Context) {
	file, header, err := c.Request.FormFile("file")

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   true,
			"message": err.Error(),
		})
		return
	}

	defer func(file multipart.File) {
		_ = file.Close()
	}(file)

	img := make([]byte, header.Size)

	if _, err = file.Read(img); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   true,
			"message": err.Error(),
		})
		return
	}

	json := c.PostForm("json")
	var product dbquery.Product

	if err = json2.Unmarshal([]byte(json), &product); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   true,
			"message": err.Error(),
		})
		return
	}

	if err = dbquery.AddProduct(product, img); err != nil {
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

func (h *AdminHandler) RemoveProductHandler(c *gin.Context) {
	var removeProductReq removeProductRequest

	if err := c.ShouldBindJSON(&removeProductReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   true,
			"message": err.Error(),
		})
		return
	}

	if err := dbquery.RemoveProduct(removeProductReq.Id); err != nil {
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
