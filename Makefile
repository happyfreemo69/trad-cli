mocha=./node_modules/mocha/bin/mocha --recursive
folders=lib
.PHONY: test $(folders) validate
test: $(folders) validate

lib:
	@$(mocha) test/lib

validate:
	@./tools/validate.js && echo "dic.jsonl is ok"

jenkins: 
	@$(mocha) --reporter mocha-jenkins-reporter --colors --reporter-options junit_report_path=./test-reports/report.xml test/lib
	@./tools/validate.js && echo "dic.jsonl is ok"
