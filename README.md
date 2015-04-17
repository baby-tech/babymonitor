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

To build a .deb file, in debinstall:

    ./redeb.sh

This will output a suitable deb in debinstall.

## Development

To run the tests:

    npm install
    npm test

You can do development on or off the pi. Being on the pi allows you to develop every aspect of the babymonitor. Doing development on another machine means you cannot directly interact with the camera module. But fear not! The camera module can be stubbed out. Read on for instructions.

### Doing dev away from a Raspberry Pi

Make sure you have [ImageMagick](http://www.imagemagick.org/) installed and run:

    node stubs/app.js

This will run the application using a dummy camera. All other aspects of the monitor can now be worked on!

## Thanks

http://www.x-com.se/labs/rasberry-pi-image-streamer/
