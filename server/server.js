import express from 'express'
import path from 'path'
// shel
import axios from 'axios'

import cors from 'cors'
import bodyParser from 'body-parser'
import sockjs from 'sockjs'
import { renderToStaticNodeStream } from 'react-dom/server'
import React from 'react'

import cookieParser from 'cookie-parser'
import config from './config'
import Html from '../client/html'

const Root = () => ''

try {
  // eslint-disable-next-line import/no-unresolved
  // ;(async () => {
  //   const items = await import('../dist/assets/js/root.bundle')
  //   console.log(JSON.stringify(items))

  //   Root = (props) => <items.Root {...props} />
  //   console.log(JSON.stringify(items.Root))
  // })()
  console.log(Root)
} catch (ex) {
  console.log(' run yarn build:prod to enable ssr')
}

let connections = []

const port = process.env.PORT || 8090
const server = express()

const middleware = [
  cors(),
  express.static(path.resolve(__dirname, '../dist/assets')),
  bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }),
  bodyParser.json({ limit: '50mb', extended: true }),
  cookieParser(),
]

middleware.forEach((it) => server.use(it))

server.use((req, res, next) => {
   res.set('x-skillcrucial-user', '47843c32-d666-4487-ab6c-139b9cbfbbc2');
   res.set('Access-Control-Expose-Headers', 'X-SKILLCRUCIAL-USER');
   next();
})
// start shel
// const { readFile, writeFile, stat, unlink } = require("fs").promises;
const { readFile, writeFile, unlink } = require("fs").promises;

server.get('/api/v1/users', async (req, res) => {
  const { data: users } = await axios('https://jsonplaceholder.typicode.com/users')
      readFile(`${__dirname}/users.json`, { encoding: "utf8" })
      .then(text => {
        res.json(JSON.parse(text))
      })
      .catch(err => {
       if (err) {
        writeFile(`${__dirname}/users.json`, JSON.stringify(users), { encoding: "utf8" })
        readFile(`${__dirname}/users.json`, { encoding: "utf8" })
          .then(text => {
            res.json(JSON.parse(text))
          })
       }
      })
})

server.delete('/api/v1/users', async (req, res) => {
  const { data: users } = await axios('https://jsonplaceholder.typicode.com/users')
      readFile(`${__dirname}/users.json`, { encoding: "utf8" })
      .then(text => {
        if(text) {
          unlink(`${__dirname}/users.json`)
          res.json ({ status: 'success' })
        }
      })
      .catch(err => {
       if (err) {
        writeFile(`${__dirname}/users.json`, JSON.stringify(users), { encoding: "utf8" })
        readFile(`${__dirname}/users.json`, { encoding: "utf8" })
          .then(text => {
            if(text) {
              unlink(`${__dirname}/users.json`)
              res.json ({ status: 'success' })
            }
          })
       }
      })
})

server.delete('/api/v1/users/:id', async (req, res) => {
  const { data: users } = await axios('https://jsonplaceholder.typicode.com/users')
      readFile(`${__dirname}/users.json`, { encoding: "utf8" })
      .then(text => {
        if(text) {
          const userses = JSON.parse(text)
          for (let i = 0; i < userses.length - 1; i += 1) {
            if (userses[i].id === +req.params.id) {
              userses.splice(i, 1)
            }
          }
          writeFile(`${__dirname}/users.json`, JSON.stringify(userses), { encoding: "utf8" })
          res.json ({ status: 'success', id: req.params.id })
        }
      })
      .catch(err => {
       if (err) {
        writeFile(`${__dirname}/users.json`, JSON.stringify(users), { encoding: "utf8" })
        readFile(`${__dirname}/users.json`, { encoding: "utf8" })
          .then(text => {
            if(text) {
              const userses2 = JSON.parse(text)
              for (let i = 0; i < userses2.length - 1; i += 1) {
                if (userses2[i].id === +req.params.id) {
                  userses2.splice(i, 1)
                }
              }
              writeFile(`${__dirname}/users.json`, JSON.stringify(userses2), { encoding: "utf8" })
              res.json ({ status: 'success', id: req.params.id })
            }
          })
       }
      })
 })

server.post('/api/v1/users', async (req, res) => {
  const { data: users } = await axios('https://jsonplaceholder.typicode.com/users')
      readFile(`${__dirname}/users.json`, { encoding: "utf8" })
      .then(text => {
        if(text) {
          const userses = JSON.parse(text)
          // const newId = userses.length + 1
          const newId = userses[userses.length - 1].id *1  + 1

          console.log(" ==============   newId   ==============")
          console.log(newId)

          const us = {id: newId}
          Object.assign(us, req.body);
          userses.push(us)
          writeFile(`${__dirname}/users.json`, JSON.stringify(userses), { encoding: "utf8" })
          res.json ({ status: 'success', id: newId })
        }
      })
      .catch(err => {
       if (err) {
        writeFile(`${__dirname}/users.json`, JSON.stringify(users), { encoding: "utf8" })
        readFile(`${__dirname}/users.json`, { encoding: "utf8" })
          .then(text => {
            if(text) {
              const userses2 = JSON.parse(text)
              // const newId2 = userses2.length + 1
              const newId2 = userses2[userses2.length - 1].id *1  + 1

              const us1 = {id: newId2}
              Object.assign(us1, req.body);
              userses2.push(us1)
              writeFile(`${__dirname}/users.json`, JSON.stringify(userses2), { encoding: "utf8" })
              res.json ({ status: 'success', id: newId2 })
            }
          })
       }
     })
})

server.patch('/api/v1/users/:userId', async (req, res) => {
  const { data: users } = await axios('https://jsonplaceholder.typicode.com/users')
      readFile(`${__dirname}/users.json`, { encoding: "utf8" })
      .then(text => {
        if(text) {
          const userses = JSON.parse(text)
          for (let i = 0; i < userses.length; i += 1) {
            if (userses[i].id === +req.params.userId) {
              Object.assign(userses[i], req.body);
            }
        }
          writeFile(`${__dirname}/users.json`, JSON.stringify(userses), { encoding: "utf8" })
          res.json ({ status: 'success', id: req.params.userId })
        }
      })
      .catch(err => {
       if (err) {
        writeFile(`${__dirname}/users.json`, JSON.stringify(users), { encoding: "utf8" })
        readFile(`${__dirname}/users.json`, { encoding: "utf8" })
          .then(text => {
            if(text) {
              const userses2 = JSON.parse(text)
              for (let i = 0; i < userses2.length; i += 1) {
                if (userses2[i].id === req.params.userId) {
                  Object.assign(userses2[i], req.body);
                }
              }
              writeFile(`${__dirname}/users.json`, JSON.stringify(userses2), { encoding: "utf8" })
              res.json ({ status: 'success', id: req.params.userId })
            }
          })
       } 
     })
})
// end shel
server.use('/api/', (req, res) => {
  res.status(404)
  res.end()
})

const [htmlStart, htmlEnd] = Html({
  body: 'separator',
  title: 'Skillcrucial - Become an IT HERO'
}).split('separator')

server.get('/', (req, res) => {
  const appStream = renderToStaticNodeStream(<Root location={req.url} context={{}} />)
  res.write(htmlStart)
  appStream.pipe(res, { end: false })
  appStream.on('end', () => {
    res.write(htmlEnd)
    res.end()
  })
})

server.get('/*', (req, res) => {
  const initialState = {
    location: req.url
  }

  return res.send(
    Html({
      body: '',
      initialState
    })
  )
})

const app = server.listen(port)

if (config.isSocketsEnabled) {
  const echo = sockjs.createServer()
  echo.on('connection', (conn) => {
    connections.push(conn)
    conn.on('data', async () => {})

    conn.on('close', () => {
      connections = connections.filter((c) => c.readyState !== 3)
    })
  })
  echo.installHandlers(app, { prefix: '/ws' })
}
console.log(`Serving at http://localhost:${port}`)
