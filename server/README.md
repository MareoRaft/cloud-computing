
main.py --> serves the website



# Build and Run

First build the latest JavaScript file:

	cd build
	bash build.bash

Then manually build the SASS->CSS if you'd made any changes.

If you made any changes to www/index.html, manually make those changes to www-built/index.html too.

Build the docker image and run the web server:

	docker build -t mvlancellotti/cloud-computing:prod -f prod.Dockerfile . && docker run --rm -p 8008:8008 --name cloud-computing-container mvlancellotti/cloud-computing:prod

Visit `localhost:8008/index.html` to see if it's working.


# Deploy

Push the built docker image:

	docker push mvlancellotti/cloud-computing:prod

then pull it onto your server, then run it:

	docker pull mvlancellotti/cloud-computing:prod
	docker run --rm -p 8008:8008 --name cloud-computing-container mvlancellotti/cloud-computing:prod

Visit `162.243.168.182:8008/index.html` to see the website.



