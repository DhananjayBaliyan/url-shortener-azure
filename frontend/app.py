from flask import Flask, render_template

# This change tells Flask that the 'static' folder is at the root level
# and should be served from the '/static' URL path.
app = Flask(__name__, static_url_path='/static', static_folder='static')

@app.route('/')
def index():
    """
    Renders the main index.html page.
    Flask will automatically look for this file in the 'templates' folder.
    """
    return render_template('index.html')

# This route will catch any short codes and let the frontend handle them
# Or, if a user directly navigates to a short link, it serves the main page
# which contains the logic to handle the redirect.
@app.route('/<short_code>')
def redirect_route(short_code):
    """
    Handles redirect logic on the client-side.
    We just need to serve the main page.
    """
    return render_template('index.html')


if __name__ == '__main__':
    # Run the app on all available network interfaces and on port 8080
    app.run(host='0.0.0.0', port=8080)
