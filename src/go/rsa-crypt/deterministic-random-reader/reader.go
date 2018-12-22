package deterministic_random_reader

import (
	"hash/fnv"
	"math/rand"
	"strconv"
)

//This Package Contains a deterministic random reader
// that is used to generate deterministic RSA private key
// from user's passphrase and eth address so that users don't
// have to keep their long RSA key file.

type Reader struct {
	passphrase []byte
	address    []byte
	generated  int
	seed       []byte
}

func NewReader(pass, addr string) *Reader {
	return &Reader{
		[]byte(pass),
		[]byte(addr),
		0,
		[]byte{},
	}
}

func (r *Reader) Read(b []byte) (n int, err error) {
	for index := range b {
		byte, err := r.ReadOneByte()
		if err != nil {
			return index, err
		}
		b[index] = byte
	}
	return len(b), nil
}

func getBytesHash64(str []byte) uint64 {
	h := fnv.New64a()
	h.Write([]byte(str))
	return h.Sum64()
}

func getBytesHash32(str []byte) uint32 {
	h := fnv.New32a()
	h.Write([]byte(str))
	return h.Sum32()
}

func (r *Reader) ReadOneByte() (byte, error) {
	if r.generated%64 == 0 {
		length := strconv.Itoa(len(r.address) + len(r.passphrase) + len(r.seed))
		hashStr := strconv.Itoa(int(getBytesHash32(r.seed)))
		r.seed = make([]byte, len(r.address)+len(r.passphrase)+len(length)+len(hashStr))
		copy(r.seed[:len(r.address)], r.address)
		copy(r.seed[len(r.address):len(r.address)+len(r.passphrase)], r.passphrase)
		copy(r.seed[len(r.address)+len(r.passphrase):len(r.address)+len(r.passphrase)+len(length)], []byte(length))
		copy(r.seed[len(r.address)+len(r.passphrase)+len(length):], []byte(hashStr))
		hash := getBytesHash64(r.seed)
		rand.Seed(int64(hash))
	}
	r.generated += 1
	b := make([]byte, 1)
	_, err := rand.Read(b)
	if err != nil {
		return 0, err
	}
	return b[0], nil
}
