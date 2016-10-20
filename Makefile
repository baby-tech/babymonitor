DEB_SOURCES = $(shell find debbuild/deb-src -type f)

all: build package

clean:
	rm -rf .deps bin vendor debbuild/*.deb

build: bin/babymonitor bin/config.json

package: debbuild/babymonitor-1.deb

debbuild/babymonitor-1.deb: bin/babymonitor-arm debbuild/redeb.sh $(DEB_SOURCES)
	cd debbuild && ./redeb.sh

bin/babymonitor: main.go camera.go listener.go bindata.go
	go build -o bin/babymonitor

bin/babymonitor-arm: main.go camera.go listener.go bindata.go
	env GOOS=linux GOARCH=arm go build -o bin/babymonitor-arm

bin/config.json: bin
	cp example/config.json bin/config.json

bin:
	mkdir bin

.deps: pins.json
	courier -reproduce
	touch .deps

bindata.go: bin/go-bindata views/index.html
	./bin/go-bindata views/

bin/go-bindata: .deps
	cd ./vendor/github.com/jteeuwen/go-bindata/go-bindata && go build -o ../../../../../bin/go-bindata


