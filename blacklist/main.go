package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"regexp"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/joho/godotenv"
)

/*
*	This module does 2 things:

	1) query raw github text file containing the blacklisted phrases once every X seconds. Stores the list in RAM as slices
	2) serve as HTTP request for other microservices to check against this list
*/

var phrases []string
var mux sync.Mutex
var SCAN_RATE uint // in seconds

// infinite loop scanning the remote list
func scanRemoteList() {

	// get list
	res, err := http.Get(os.Getenv("LIST_URL"))
	if err != nil {
		fmt.Println(err)
		time.Sleep(time.Duration(SCAN_RATE) * time.Second)
		return
	}

	// attempt to read list
	bytes, err := ioutil.ReadAll(res.Body)
	if err != nil {
		fmt.Println(err)
		time.Sleep(time.Duration(SCAN_RATE) * time.Second)
		return
	}

	// process list
	mux.Lock()

	// split text by \n
	phrases = strings.Split(string(bytes), "\n")

	// remove comment lines && empty lines
	i := 0
	l := len(phrases)

	for i < l {
		s := phrases[i]

		if strings.Index(s, "#") == 0 || s == "" {
			phrases[i] = phrases[l-1]
			phrases = phrases[:l-1]
			l--
		} else {
			i++
		}
	}

	mux.Unlock()

	time.Sleep(time.Duration(SCAN_RATE) * time.Second)
	go scanRemoteList()
}

// checks data (from/to) against phrases list
// if match is found, then bool = false
func checkData(d *map[string]interface{}) bool {

	from := strings.ToLower(strings.ReplaceAll((*d)["from"].(string), "\n", ""))
	text := strings.ToLower(strings.ReplaceAll((*d)["text"].(string), "\n", ""))

	mux.Lock()

	for _, v := range phrases {

		// check "from" field
		b, err := regexp.MatchString(`.*`+v+`.*`, from)
		if err == nil {

			if b {
				mux.Unlock()
				return false
			} else {

				// check body text
				b, err = regexp.MatchString(`.*`+v+`.*`, text)
				if err == nil && b {
					mux.Unlock()
					return false
				} else {
					continue
				}
			}

		}

	}

	mux.Unlock()
	return true
}

// local requests handler
func reqHandler(w http.ResponseWriter, r *http.Request) {
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		panic(err)
	}

	data := map[string]interface{}{}
	err = json.Unmarshal(body, &data)
	if err != nil {
		panic(err)
	}

	res := map[string]interface{}{"safe": checkData(&data)}
	resBytes := []byte{}
	resBytes, _ = json.Marshal(res)
	w.WriteHeader(200)
	w.Header().Add("Content-type", "application/json")
	w.Write(resBytes)
}

// starts the local server with a handler
func startLocalServer() {
	http.HandleFunc("/", reqHandler)

	fmt.Println("Starting server @ ", os.Getenv("LISTEN_HOST"))
	err := http.ListenAndServe(os.Getenv("LISTEN_HOST"), nil)
	if err != nil {
		panic(err)
	}
}

// retrieves and formats the rate
func getRate() uint {
	v, err := strconv.Atoi(os.Getenv("SCAN_RATE"))
	if err != nil {
		// can't continue on bad env
		panic(err)
	}

	return uint(v)
}

func main() {
	err := godotenv.Load()
	if err != nil {
		panic("Error loading .env file!")
	}

	SCAN_RATE = getRate()

	go scanRemoteList()

	startLocalServer()
}
