package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"

	"github.com/gorilla/websocket"
)

type Config struct {
	Host string
	Port uint16
}

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
	configPath := flag.String("config", "./config.json", "path to config file")
	flag.Parse()

	contents, err := ioutil.ReadFile(*configPath)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Cannot read %s: [%s]\n", *configPath, err)
		os.Exit(1)
	}

	var config Config
	err = json.Unmarshal(contents, &config)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Cannot deserialise %s: [%s]\n", *configPath, err)
		os.Exit(2)
	}

	newListener := make(chan *Listener)
	listenerShutdown := make(chan ListenerId)

	go func() {
		var camera *Camera = nil
		images := make(chan string)
		listeners := []*Listener{}
		for {
			select {
			case listener := <-newListener:
				listeners = append(listeners, listener)
				if camera == nil {
					camera = NewCamera(images)
				}
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
				if len(listeners) == 0 && camera != nil {
					camera.Stop()
					camera = nil
				}
			case image := <-images:
				for _, listener := range listeners {
					listener.Receive(image)
				}
			}
		}
	}()

	http.HandleFunc("/", rootHandler)
	http.HandleFunc("/listen", listenHandler(newListener, listenerShutdown))
	bind := fmt.Sprintf("%s:%d", config.Host, config.Port)
	err = http.ListenAndServe(bind, nil)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Cannot bind to %s: [%s]\n", bind, err)
		os.Exit(3)
	}
}
