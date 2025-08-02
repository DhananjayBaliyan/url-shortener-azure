from flask import Flask, render_template

# Initialize the Flask application
app = Flask(__name__)

@app.route('/')
def index():
    """
    Renders the main index.html page.
    Flask will automatically look for this file in the 'templates' folder.
    """
    return render_template('index.html')

if __name__ == '__main__':
    # Run the app on all available network interfaces and on port 8080
    app.run(host='0.0.0.0', port=8080)
