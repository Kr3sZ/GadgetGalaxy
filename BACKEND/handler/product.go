package handler

import (
	"errors"
	"fmt"
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"

	"gadgetGalaxy/dbquery"
)

type (
	ProductHandler struct {
	}

	searchRequest struct {
		Keyword  string `json:"keyword"`
		Category string `json:"category"`
		Sort     int64  `json:"sort"`
	}

	orderRequest struct {
		Products []dbquery.OrderProduct `json:"products"`
		Address  string                 `json:"address"`
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

	products, err := dbquery.SearchProducts(search.Keyword, search.Category)

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

func (h *ProductHandler) ProductImageHandler(c *gin.Context) {
	idStr, exists := c.Params.Get("id")

	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   true,
			"message": "error: did not specify product id",
		})
		return
	}

	id, err := strconv.ParseInt(idStr, 10, 64)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   true,
			"message": err.Error(),
		})
		return
	}

	var img []byte
	img, err = dbquery.SelectProductImage(id)

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

	fn := fmt.Sprintf("product_%d.png", id)

	c.Header("Content-Description", "File Transfer")
	c.Header("Content-Transfer-Encoding", "binary")
	c.Header("Content-Disposition", fmt.Sprintf("inline; filename=%s", fn))
	c.Data(http.StatusOK, "application/octet-stream", img)
}

func (h *ProductHandler) AllCategoriesHandler(c *gin.Context) {
	categories, err := dbquery.SelectAllCategories()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   true,
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"error":   false,
		"message": categories,
	})
}

func (h *ProductHandler) UserCartHandler(c *gin.Context) {
	session := sessions.Default(c)
	token := session.Get("id")
	user, err := dbquery.SelectUserByToken(fmt.Sprint(token))

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   true,
			"message": err.Error(),
		})
		return
	}

	products, err := dbquery.SelectUserCart(user.Username)

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

func (h *ProductHandler) OrderHandler(c *gin.Context) {
	var order orderRequest

	if err := c.ShouldBindJSON(&order); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   true,
			"message": err.Error(),
		})
		return
	}

	session := sessions.Default(c)
	token := session.Get("id")
	user, err := dbquery.SelectUserByToken(fmt.Sprint(token))

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   true,
			"message": err.Error(),
		})
		return
	}

	if err = dbquery.AddOrder(user.Username, order.Products, order.Address); err != nil {
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

	c.JSON(http.StatusOK, gin.H{
		"error":   false,
		"message": "success",
	})
}
