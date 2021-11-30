#! /bin/bash

TARGETDIR=~/projects/static-website/$WEB_BASEPATH

mkdir -p $TARGETDIR
rm -rf $TARGETDIR/hotelui
mkdir -p $TARGETDIR/hotelui

cp -R css de en fonts images index.html js locales $TARGETDIR/hotelui

