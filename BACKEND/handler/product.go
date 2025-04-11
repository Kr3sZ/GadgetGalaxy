package handler

import (
	"github.com/gin-gonic/gin"
	"net/http"

	"gadgetGalaxy/dbquery"
)

type (
	ProductHandler struct {
	}
)

func NewProductHandler() *ProductHandler {
	return &ProductHandler{}
}

func (h *ProductHandler) AllProductsHandler(c *gin.Context) {
	products, err := dbquery.SelectAllProducts()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   true,
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"error":   false,
		"message": products,
	})
}
