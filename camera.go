package main

import (
	"encoding/base64"
	"fmt"
	"os"
	"os/exec"
	"strconv"
	"time"
)

const WIDTH = 640
const HEIGHT = 480
const INTERVAL = 100
const MAX_EXPOSURE_TIME = 500

type Camera struct {
	images chan string
	done   chan struct{}
}

func capture() (string, error) {
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
		return "", err
	}
	return fmt.Sprintf("data:image/jpeg;base64,%s", base64.StdEncoding.EncodeToString([]byte(out))), nil
}

func NewCamera(images chan string) *Camera {
	c := &Camera{
		images: images,
		done:   make(chan struct{}, 1),
	}

	go func() {
		ticker := time.NewTicker(INTERVAL * time.Millisecond)
		for {
			select {
			case <-c.done:
				return
			case <-ticker.C:
				image, err := capture()
				if err == nil {
					c.images <- image
				} else {
					fmt.Fprintf(os.Stderr, err.Error())
				}
			}
		}
	}()

	return c
}

func (c *Camera) Stop() {
	select {
	case c.done <- struct{}{}:
	default:
	}
}
