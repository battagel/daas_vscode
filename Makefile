VSCE=vsce
ECHO=echo

NAME := daas_api
VER := latest

## help: Print this message
.PHONY: help
help:
	@fgrep -h '##' $(MAKEFILE_LIST) | fgrep -v fgrep | column -t -s ':' | sed -e 's/## //'

## build: Create the .vsix package
.PHONY: build
build:
	@$(VSCE) package

## run: Run the extension
.PHONY: run
run:
	@$(ECHO) "Launch folder is vscode, then F5."

## publish: Publish the extension to Azure
.PHONY: publish
publish: build
	@$(VSCE) publish
