#! /bin/bash

TARGETDIR=~/projects/static-website/$WEB_BASEPATH

mkdir -p $TARGETDIR
rm -rf $TARGETDIR/hotelui
rm -rf $TARGETDIR/hotelbackend
mkdir -p $TARGETDIR/hotelui
mkdir -p $TARGETDIR/hotelbackend

cp -R css de en fonts images index.html js locales $TARGETDIR/hotelui
cp backend/index.php $TARGETDIR/hotelbackend 

