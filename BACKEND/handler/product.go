package handler

import (
	"github.com/gin-gonic/gin"
	"net/http"

	"gadgetGalaxy/dbquery"
)

type (
	ProductHandler struct {
	}

	searchRequest struct {
		Keyword  string       `json:"keyword"`
		Category string       `json:"category"`
		Sort     dbquery.Sort `json:"sort"`
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

func (h *ProductHandler) SearchProductHandler(c *gin.Context) {
	var search searchRequest

	if err := c.ShouldBindJSON(&search); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   true,
			"message": err.Error(),
		})
		return
	}

	products, err := dbquery.SearchProducts(search.Keyword, search.Category, search.Sort)

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
