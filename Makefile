all: build package

clean:
	rm -rf bin vendor debbuild/*.deb

build: bin vendor bindata.go
	go build -o bin/babymonitor

bin:
	mkdir bin

vendor: pins.json
	courier -reproduce

pins.json: deps.json
	courier

bindata.go: bin/go-bindata views/index.html
	./bin/go-bindata views/

bin/go-bindata: vendor
	cd ./vendor/github.com/jteeuwen/go-bindata/go-bindata && go build -o ../../../../../bin/go-bindata

package: bin vendor bindata.go
	env GOOS=linux GOARCH=arm go build -o bin/babymonitor-arm
	cd debbuild && ./redeb.sh
