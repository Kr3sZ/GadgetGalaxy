package utils

import (
	"hash/fnv"
)

func Hash(str string) (uint32, error) {
	h := fnv.New32a()

	if _, err := h.Write([]byte(str)); err != nil {
		return 0, err
	}

	return h.Sum32(), nil
}
