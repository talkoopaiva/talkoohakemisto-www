TALKOOHAKEMISTO FRONTEND
========================

## Running locally ##

To run locally you will need to install [Node.js](http://nodejs.org) and
[grunt](http://github.com/gruntjs/grunt).

``` bash
# Clone the repository.
git clone https://github.com/talkoopaiva/talkoohakemisto-api.git

# Install global dependencies.  Depending on your user account you may need to
# gain elevated privileges using something like sudo`.
npm install -g grunt-cli bower


# Navigate into the created directory and install the Node dependencies and Bower dependencies.
npm install -q

# Install Bower dependencies.
bower install

# Run the server
grunt server
```

