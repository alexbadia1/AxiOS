#!/bin/sh
tsc --version
tsc --rootDir source/ --outDir distrib/  *.ts host/*.ts os/*.ts
