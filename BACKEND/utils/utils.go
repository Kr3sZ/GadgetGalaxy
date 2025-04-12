package utils

import (
	"crypto/sha256"
)

func Hash(str string) ([]byte, error) {
	h := sha256.New()

	h.Write([]byte(str))

	return h.Sum(nil), nil
}
