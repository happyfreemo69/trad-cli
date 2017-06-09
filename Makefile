mocha=./node_modules/mocha/bin/mocha --recursive
folders=lib
.PHONY: test $(folders)
test: $(folders)

lib:
	@$(mocha) test/lib

