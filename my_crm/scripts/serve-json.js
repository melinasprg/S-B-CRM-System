const { spawn } = require('child_process')
const port = process.env.PORT || 3001
const server = spawn(
  'npx',
  ['json-server', '--watch', 'db.json', '--port', port],
  {
    stdio: 'inherit',
    shell: true
  }
)

server.on('close', (code) => {
  process.exit(code)
})
