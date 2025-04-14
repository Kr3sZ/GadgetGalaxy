package dbquery

import (
	"database/sql"
	"errors"
	"github.com/go-sql-driver/mysql"
	"strings"
)

var (
	db              *sql.DB
	NotFoundErr     = errors.New("error: not found")
	UnexpectedErr   = errors.New("error: unexpected")
	NotAvailableErr = errors.New("error: product not available")
)

func ConnectToDb(user string, pass string, addr string, dbName string) error {
	cfg := mysql.Config{
		User:                 user,
		Passwd:               pass,
		Net:                  "tcp",
		Addr:                 addr,
		DBName:               dbName,
		AllowNativePasswords: true,
		AllowOldPasswords:    true,
	}

	var err error
	db, err = sql.Open("mysql", cfg.FormatDSN())

	if err != nil {
		return err
	}

	err = db.Ping()

	if err != nil {
		return err
	}

	return nil
}

type (
	User struct {
		Username  string `json:"username"`
		FirstName string `json:"firstName"`
		LastName  string `json:"lastName"`
		Email     string `json:"email"`
		PhoneNum  string `json:"phoneNum"`
		Password  string `json:"password"`
		BirthDate string `json:"birthDate"`
	}

	Product struct {
		Id          int64   `json:"id"`
		Name        string  `json:"name"`
		Category    string  `json:"category"`
		Price       float64 `json:"price"`
		Amount      int     `json:"amount"`
		Description string  `json:"description"`
	}

	OrderProduct struct {
		Id       int64 `json:"id"`
		Quantity int64 `json:"quantity"`
	}

	Sort int64
)

const (
	None Sort = iota
	PriceAsc
	PriceDesc
	NameAsc
	NameDesc
)

func RegisterUser(user User, token string) (sql.Result, error) {
	return db.Exec("insert into users (username, first_name, last_name, email, phone_num, password, birth_date, token) values (?, ?, ?, ?, ?, ?, ?, ?)",
		user.Username, user.FirstName, user.LastName, user.Email, user.PhoneNum, user.Password, user.BirthDate, token)
}

func SelectUserPassword(username string) (string, error) {
	row, err := db.Query("select password from users where username like ?", username)

	if err != nil {
		return "", err
	}

	if !row.Next() {
		return "", NotFoundErr
	}

	var pass string

	if err = row.Scan(&pass); err != nil {
		return "", err
	}

	return pass, nil
}

func SelectUserToken(username string) (string, error) {
	row, err := db.Query("select token from users where username like ?", username)

	if err != nil {
		return "", err
	}

	if !row.Next() {
		return "", NotFoundErr
	}

	var token string

	if err = row.Scan(&token); err != nil {
		return "", err
	}

	return token, err
}

func SelectUserByName(username string) (User, error) {
	row, err := db.Query("select username, first_name, last_name, email, phone_num, password, birth_date from users where username like ?", username)

	if err != nil {
		return User{}, err
	}

	if !row.Next() {
		return User{}, NotFoundErr
	}

	var user User

	err = row.Scan(&user.Username,
		&user.FirstName,
		&user.LastName,
		&user.Email,
		&user.PhoneNum,
		&user.Password,
		&user.BirthDate)

	if err != nil {
		return User{}, err
	}

	return user, nil
}

func SelectUserByToken(token string) (User, error) {
	username, err := SelectUsernameFromToken(token)

	if err != nil {
		return User{}, err
	}

	return SelectUserByName(username)
}

func SelectUsernameFromToken(token string) (string, error) {
	row, err := db.Query("select username from users where token like ?", token)

	if err != nil {
		return "", err
	}

	if !row.Next() {
		return "", NotFoundErr
	}

	var username string

	if err = row.Scan(&username); err != nil {
		return "", err
	}
	return username, nil
}

func UpdateUser(newUser User) error {
	username := newUser.Username
	oldUser, err := SelectUserByName(username)

	if err != nil {
		return err
	}

	if newUser.FirstName != oldUser.LastName {
		if _, err = updateUserFirstName(username, newUser.FirstName); err != nil {
			return err
		}
	}

	if newUser.LastName != oldUser.LastName {
		if _, err = updateUserLastName(username, newUser.LastName); err != nil {
			return err
		}
	}

	if newUser.Email != oldUser.Email {
		if _, err = updateUserEmail(username, newUser.Email); err != nil {
			return err
		}
	}

	if newUser.PhoneNum != oldUser.PhoneNum {
		if _, err = updateUserPhoneNum(username, newUser.PhoneNum); err != nil {
			return err
		}
	}

	return nil
}

func updateUserFirstName(username string, firstName string) (sql.Result, error) {
	return db.Exec("update users set first_name = ? where username like ?", firstName, username)
}

func updateUserLastName(username string, lastName string) (sql.Result, error) {
	return db.Exec("update users set last_name = ? where username like ?", lastName, username)
}

func updateUserEmail(username string, email string) (sql.Result, error) {
	return db.Exec("update users set email = ? where username like ?", email, username)
}

func updateUserPhoneNum(username string, phoneNum string) (sql.Result, error) {
	return db.Exec("update users set phone_num = ? where username like ?", phoneNum, username)
}

func UpdateUserPassword(username string, password string) (sql.Result, error) {
	return db.Exec("update users set password = ? where username like ?", password, username)
}

func SelectAllProducts() ([]Product, error) {
	rows, err := db.Query("select id, name, category, price, amount, description from products")

	if err != nil {
		return nil, err
	}

	var products []Product

	for rows.Next() {
		var product Product

		err = rows.Scan(&product.Id,
			&product.Name,
			&product.Category,
			&product.Price,
			&product.Amount,
			&product.Description)

		if err != nil {
			return nil, err
		}

		products = append(products, product)
	}

	return products, nil
}

func SearchProducts(keyword string, category string, sort Sort) ([]Product, error) {
	var products []Product
	var err error

	if sort == None {
		if products, err = SelectAllProducts(); err != nil {
			return nil, err
		}
	} else {
		var order string

		switch sort {
		case PriceAsc:
			order = "price ASC"
			break

		case PriceDesc:
			order = "price DESC"
			break

		case NameAsc:
			order = "name ASC"
			break

		case NameDesc:
			order = "name DESC"
			break

		default:
			return nil, UnexpectedErr
		}

		var rows *sql.Rows
		rows, err = db.Query("select id, name, category, price, amount, description from products order by ?", order)

		if err != nil {
			return nil, err
		}

		for rows.Next() {
			var product Product

			err = rows.Scan(&product.Id,
				&product.Name,
				&product.Category,
				&product.Price,
				&product.Amount,
				&product.Description)

			if err != nil {
				return nil, err
			}

			products = append(products, product)
		}
	}

	var foundProd []Product

	lowerKeyword := strings.ToLower(keyword)
	lowerCat := strings.ToLower(category)

	for _, product := range products {
		lowerName := strings.ToLower(product.Name)
		lowerDesc := strings.ToLower(product.Description)
		lowerProdCat := strings.ToLower(product.Category)

		if (strings.Contains(lowerName, lowerKeyword) || strings.Contains(lowerDesc, lowerKeyword)) && strings.Contains(lowerProdCat, lowerCat) {
			foundProd = append(foundProd, product)
		}
	}

	return foundProd, nil
}

func SelectProductImage(id int64) ([]byte, error) {
	row, err := db.Query("select image from products where id = ?", id)

	if err != nil {
		return nil, err
	}

	if !row.Next() {
		return nil, NotFoundErr
	}

	var img []byte

	if err = row.Scan(&img); err != nil {
		return nil, err
	}

	return img, nil
}

func AddOrder(username string, products []OrderProduct, address string) error {
	row, err := db.Query("select * from users where username = ?", username)

	if err != nil {
		return err
	}

	if !row.Next() {
		return NotFoundErr
	}

	_, err = db.Exec("insert into orders (username, address, status) values (?, ?, 'preparing')", username, address)

	if err != nil {
		return err
	}

	var id int64
	row, err = db.Query("select id from orders where username like ? order by id desc limit 1", username)

	if err != nil {
		return err
	}

	if !row.Next() {
		return UnexpectedErr
	}

	err = row.Scan(&id)

	if err != nil {
		return err
	}

	for _, val := range products {
		row, err = db.Query("select * from products where id = ? and amount >= ?", val.Id, val.Quantity)

		if err != nil {
			return err
		}

		if !row.Next() {
			return NotAvailableErr
		}

		_, err = db.Exec("insert into order_product (order_id, prod_id, amount) values (?, ?, ?)", id, val.Id, val.Quantity)

		if err != nil {
			return err
		}

		_, err = db.Exec("update products set amount = amount - ? where id = ?", val.Quantity, val.Id)

		if err != nil {
			return err
		}
	}

	return nil
}

func SelectAdminPassword(username string) (string, error) {
	row, err := db.Query("select password from admin where username like ?", username)

	if err != nil {
		return "", err
	}

	if !row.Next() {
		return "", NotFoundErr
	}

	var pass string

	if err = row.Scan(&pass); err != nil {
		return "", err
	}

	return pass, nil
}
