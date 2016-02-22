from tornado.web import RequestHandler
from tornado.web import StaticFileHandler
from tornado.web import Application
from tornado.web import url #constructs a URLSpec for you
from tornado.ioloop import IOLoop


class BaseHandler (RequestHandler):
	def initialize(self, var):
		#init stuff!
		print( var )
		pass
	def get(self):
		self.write("You have reached the BaseHandler!! If you want the real website, add /index.html to your url path!")

class FormHandler (BaseHandler):
	def get(self):
		# / is relative
		self.write("""	<form action='/form' method='post'>
							<input type='text' name='thisistheonlyinput' />
							<input type='submit' value='Submit' />
						</form>
					""")
	def post(self):
		invar = self.get_body_argument("thisistheonlyinput")
		print( "going to post the input!"+invar )

def make_app():
	return Application(
		[
			url( '/', BaseHandler, { "var":"nothing" }, name="root" ), # this is for the root! :)
			url( r'/here(\d)', BaseHandler, { "var":"tar" }, name = "here" ), # regex quote!
			url( '/form', FormHandler, { "var":"initialize this!" }, name = "forlorn" ),
			url( '/(.*)', StaticFileHandler, { "path":"../www/" } ), # captures anything at all, and serves it as a static file. simple!
		],
		#settings
		debug = True,
	)


def main():
	application = make_app()
	application.listen(8008)
	#other stuff
	IOLoop.current().start()

if __name__ == "__main__": main()
