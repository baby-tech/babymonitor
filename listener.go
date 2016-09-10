package main

import (
	"crypto/rand"
	"encoding/hex"

	"github.com/gorilla/websocket"
)

type ListenerId string

type Listener struct {
	Id   ListenerId
	Data chan string
}

func NewListener(conn *websocket.Conn, shutdown chan ListenerId) (*Listener, error) {
	id, err := GenID()
	if err != nil {
		return nil, err
	}
	data := make(chan string, 1)
	listener := &Listener{
		Id:   id,
		Data: data,
	}
	go func() {
		for {
			select {
			case d := <-data:
				if err = conn.WriteMessage(websocket.TextMessage, []byte(d)); err != nil {
					shutdown <- id
					return
				}
			}
		}
	}()
	return listener, nil
}

func (l *Listener) Receive(data string) {
	select {
	case l.Data <- data:
	default:
	}
}

func GenID() (ListenerId, error) {
	id := make([]byte, 16)
	_, err := rand.Read(id)
	if err != nil {
		return "", err
	}
	return ListenerId(hex.EncodeToString(id)), nil
}
