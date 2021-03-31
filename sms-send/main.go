package main

import (
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	tyx "github.com/tgbv/telnyx-golang/pkg"
)

// globals
var Telnyx *tyx.Telnyx

/*
*	reads the request body and returns bytes!
 */
func readBody(body *io.ReadCloser) []byte {
	bytes, err := ioutil.ReadAll(*body)
	if err != nil {
		panic(err)
	} else {
		return bytes
	}
}

/*
*	parses json into map
 */
func parseJson(j *[]byte) map[string]interface{} {
	unmarshaled := map[string]interface{}{}
	err := json.Unmarshal(*j, &unmarshaled)
	if err != nil {
		panic(err)
	} else {
		return unmarshaled
	}
}

/*
*	handler function
 */
func handler(w http.ResponseWriter, r *http.Request) {
	bodyBytes := readBody(&r.Body)
	data := parseJson(&bodyBytes)

	// send message to telnyx
	res, err := Telnyx.Messaging.Send(map[string]interface{}{
		"from":    data["from"].(string),
		"to":      data["to"].(string),
		"text":    data["text"].(string),
		"profile": os.Getenv("MESSAGING_PROFILE"),
	})

	if err != nil {
		w.WriteHeader(500)

		// strip the first line
		e := []byte(err.Error())
		for i, v := range e {

			if string(v) == "\n" {
				e = e[i+1:]
				break
			}
		}

		w.Write(e)
	} else {
		out, _ := json.Marshal(res)

		w.Write(out)
	}

}

/*
*	starts the server
 */
func Start(host string) {
	http.HandleFunc("/", handler)

	err := http.ListenAndServe(host, nil)
	if err != nil {
		panic(err)
	}
}

/*
*	main thread
 */
func main() {
	// init dotenv
	err := godotenv.Load()
	if err != nil {
		panic("Error loading .env file")
	}
	fmt.Println("Initialized dotenv.")

	// init telnyx
	Telnyx = tyx.Init(map[string]string{
		"user": os.Getenv("API_USER"),
		"v1":   os.Getenv("API_V1"),
		"v2":   os.Getenv("API_V2"),
	})
	fmt.Println("Initialized telnyx.")

	// start server
	fmt.Println("Server starting and listening on:", os.Getenv("SERVER_HOST"), "...")
	Start(os.Getenv("SERVER_HOST"))

}
