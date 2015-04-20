# babymonitor

A Raspberry Pi based baby monitor

[![Build Status](https://snap-ci.com/baby-tech/babymonitor/branch/master/build_image)](https://snap-ci.com/baby-tech/babymonitor/branch/master)

## Purpose

A tool to allow monitoring of your baby, even at night. Based on a [Raspberry Pi](http://www.raspberrypi.org/) and the [NoIR camera](http://www.raspberrypi.org/products/pi-noir-camera/).

## Installation

Assuming you have a NoIR camera and a Raspbery Pi, ensure that `raspistill` is [installed](http://www.raspberrypi.org/documentation/configuration/camera.md). Once your camera is attached and working, run the following on the pi:

    git clone https://github.com/baby-tech/babymonitor.git
    cd babymonitor
    npm install --production
    npm start

Then connect to your pi using a browser on port `8888`. You should see images coming through within minutes.

## Building (unfinished)

To build a deb file:

    cd debbuild
    ./redeb.sh

This will output a suitable deb in debinstall.

## Development

To run the tests:

    npm install
    npm test

You can do development on or off the pi. Being on the pi allows you to develop every aspect of the babymonitor. Doing development on another machine means you cannot directly interact with the camera module. But fear not! The camera module can be stubbed out. Read on for instructions.

### Development away from a Raspberry Pi

You'll need [Vagrant](https://www.vagrantup.com/) working. Then do the following:

    git clone https://github.com/baby-tech/babymonitor.git
    cd babymonitor/infra/vagrant
    vagrant up
    vagrant ssh
    cd workspace
    npm install
    npm start

At this point you'll have a the application running on `http://localhost:8888/` serving a dummy image. Woohoo!

## Thanks

http://www.x-com.se/labs/rasberry-pi-image-streamer/
