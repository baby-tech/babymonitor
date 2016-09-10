package main

import (
	"encoding/base64"
	"fmt"
	"net/http"
	"os"
	"os/exec"
	"strconv"
	"time"

	"github.com/gorilla/websocket"
)

const WIDTH = 640
const HEIGHT = 480
const INTERVAL = 2
const MAX_EXPOSURE_TIME = 500

func rootHandler(w http.ResponseWriter, r *http.Request) {
	data, err := Asset("views/index.html")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	_, err = w.Write(data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024 * 1024,
	WriteBufferSize: 1024 * 1024,
}

func listenHandler(newListener chan *Listener, listenerShutdown chan ListenerId) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		listener, err := NewListener(conn, listenerShutdown)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		newListener <- listener
	}
}

func main() {
	newListener := make(chan *Listener)
	listenerShutdown := make(chan ListenerId)
	newData := make(chan string)

	go func() {
		listeners := make([]*Listener, 0)
		for {
			select {
			case listener := <-newListener:
				listeners = append(listeners, listener)
			case id := <-listenerShutdown:
				i := -1
				for x, l := range listeners {
					if l.Id == id {
						i = x
						break
					}
				}
				if i >= 0 {
					listeners = append(listeners[:i], listeners[i+1:]...)
				}
			case data := <-newData:
				for _, listener := range listeners {
					listener.Receive(data)
				}
			}
		}
	}()

	go func() {
		ticker := time.NewTicker(INTERVAL * time.Second)
		for {
			<-ticker.C
			out, err := exec.Command("raspistill",
				"--timeout", strconv.Itoa(MAX_EXPOSURE_TIME),
				"--encoding", "jpg",
				"--width", strconv.Itoa(WIDTH),
				"--height", strconv.Itoa(HEIGHT),
				"--quality", "50",
				// Text must start with a non-digit character.
				// Raspistill interprets a start digit as a bitmask for flags.
				"--annotate", time.Now().Format("Time: 20060102150405"),
				"-o",
				"-",
			).Output()
			if err != nil {
				fmt.Fprintf(os.Stderr, err.Error())
			} else {
				encodedData := base64.StdEncoding.EncodeToString([]byte(out))
				newData <- fmt.Sprintf("data:image/jpeg;base64,%s", encodedData)
			}
		}
	}()

	http.HandleFunc("/", rootHandler)
	http.HandleFunc("/listen", listenHandler(newListener, listenerShutdown))
	http.ListenAndServe(":8888", nil)
}
