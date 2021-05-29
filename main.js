// AXIOS GLOBALS
axios.defaults.headers.common['X-Auth-Token'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

// GET REQUEST
const getTodos = () => {
    instance
        .get(`todos?_limit=5`, { timeout: 3000 })
        .then(res => showOutput(res))
        .catch(err => console.error(err))
}

// POST REQUEST
const addTodo = () => {
    instance
        .post('todos', {
            title: 'My Todo',
            completed: true
        })
        .then(res => showOutput(res))
        .catch(err => console.error(err))
}

// PUT/PATCH REQUEST
const updateTodo = () => {
    instance
        .patch('todos/2', {
            title: 'Updated Todo',
            completed: true
        })
        .then(res => showOutput(res))
        .catch(err => console.error(err))
}

// DELETE REQUEST
const removeTodo = () => {
    instance
        .delete('todos/2')
        .then(res => showOutput(res))
        .catch(err => console.error(err))
}

// SIMULTANEOUS REQUEST
const getData = () => {
    axios.all([
        instance.get('todos?_limit=5'),
        instance.get('posts?_limit=5')
    ])
        .then(axios.spread((todos, posts) => showOutput(todos)))
        .catch(err => console.error(err))
}

// CUSTOM HEADERS
const customHeaders = () => {
    const config = {
        headers: {
            'Content-type': 'application/json',
            Authorization: 'token'
        }
    }

    instance
        .post('todos', {
            title: 'My Todo',
            completed: true
        }, config)
        .then(res => showOutput(res))
        .catch(err => console.error(err))
}

// TRANSFORMING REQUESTS & RESPONSES
const transformResponse = () => {
    const options = {
        method: 'post',
        url: 'todos',
        data: {
            title: 'Hello'
        },
        transformResponse: axios.defaults.transformResponse.concat(data => {
            data.title = 'Hello world'
            return data
        })
    }

    instance(options).then(res => showOutput(res))
}

// ERROR HANDLING
const errorHandling = () => {
    instance
        .get(`todose`, {
            /*validateStatus: function(status) {
                return status < 500; // Reject only if status greater or equal than 500
            }*/
        })
        .then(res => showOutput(res))
        .catch(err => {
            if (err.response) {
                // Server responded with status other than 200 range
                console.log('Error data -> ' + JSON.stringify(err.response.data))
                console.log('Error status -> ' + err.response.status)
                console.log(err.response.headers)
            } else if (err.request) {
                // Request was made but there is no response
                console.error(err.request)
            } else {
                console.error(err.message)
            }
        })
}

// CANCEL TOKEN
const cancelToken = () => {
    const source = axios.CancelToken.source()

    instance
        .get(`todos`, {
            cancelToken: source.token
        })
        .then(res => showOutput(res))
        .catch(thrown => {
            if (axios.isCancel(thrown)) {
                console.log('Request cancelled!!!', thrown.message)
            }
        })

    if (true) {
        source.cancel('Request cancelled')
    }
}


// AXIOS INSTANCE
const baseURL = 'https://jsonplaceholder.typicode.com/'
const instance = axios.create({
    baseURL: baseURL
})


// INTERCEPTING REQUESTS & RESPONSES
instance.interceptors.request.use(config => {
    console.log(`Method ${config.method.toUpperCase()} sent to ${baseURL + config.url} at ${new Date().toLocaleTimeString()}`)
    return config
}, error => {
    return Promise.reject(error)
})

// Show output in browser
const showOutput = (res) => {
    document.getElementById('res').innerHTML = `
  <div class="card card-body mb-4">
    <h5>Status: ${res.status}</h5>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Headers
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.headers, null, 2)}</pre>
    </div>
  </div>

    <div class="card mt-3">
    <div class="card-header">
      Config
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.config, null, 2)}</pre>
    </div>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Data
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.data, null, 2)}</pre>
    </div>
  </div>
`;
}

// Event listeners
document.getElementById('get').addEventListener('click', getTodos);
document.getElementById('post').addEventListener('click', addTodo);
document.getElementById('update').addEventListener('click', updateTodo);
document.getElementById('delete').addEventListener('click', removeTodo);
document.getElementById('sim').addEventListener('click', getData);
document.getElementById('headers').addEventListener('click', customHeaders);
document
    .getElementById('transform')
    .addEventListener('click', transformResponse);
document.getElementById('error').addEventListener('click', errorHandling);
document.getElementById('cancel').addEventListener('click', cancelToken);
