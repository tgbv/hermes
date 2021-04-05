package main

import "sync"

/*
*	This module does 2 things:

	1) query raw github text file containing the blacklisted phrases once every X seconds. Stores the list in RAM as slices
	2) serve as HTTP request for other microservices to check against this list
*/

var phrases []string
var mux sync.Mutex

func main() {

}
