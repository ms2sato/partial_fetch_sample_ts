import express from "express"
const router = express.Router()

import pug from 'pug'
import path from 'path'

let titleCounter = 0
const messages: string[] = [
  'テスト1',
  'テスト2'
]

/* GET users listing. */
router.get(
  "/",
  async function (
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) {
    res.render('user', { titleCounter: titleCounter++, messages })
  },
);

class PartialRenderer {
  private req: express.Request
  private res: express.Response
  private ret: Record<string, Record<string, string>>

  constructor(req: express.Request, res: express.Response) {
    this.req = req
    this.res = res
    this.ret = { partials: {} }
  }

  add(selector: string, view: string, options = {}) {
    const templatePath = path.join(this.req.app.settings.views, view)
    const html = pug.renderFile(templatePath, options)
    this.ret.partials[selector] = html
  }

  render() {
    this.res.json(this.ret)
  }
}

router.get('/time', async function (
  req: express.Request,
  res: express.Response,
  _next: express.NextFunction
) {
  const renderer = new PartialRenderer(req, res)
  renderer.add('#output', '/user/time.pug')
  renderer.render()
})

router.get('/title', async function (
  req: express.Request,
  res: express.Response,
  _next: express.NextFunction
) {
  const renderer = new PartialRenderer(req, res)
  renderer.add('#title', '/user/title.pug', { titleCounter: titleCounter++ })
  renderer.render()
})

router.get('/multi', async function (
  req: express.Request,
  res: express.Response,
  _next: express.NextFunction
) {
  const renderer = new PartialRenderer(req, res)
  renderer.add('#output', '/user/time.pug')
  renderer.add('#title', '/user/title.pug', { titleCounter: titleCounter++ })
  renderer.render()
})

router.post('/messages', async function (
  req: express.Request,
  res: express.Response,
  _next: express.NextFunction
) {
  console.log(req.body)
  console.log(req.params)

  const message = req.body.message
  messages.push(message)

  console.log(message)

  const renderer = new PartialRenderer(req, res)
  renderer.add('ul', '/user/message.pug', { message })
  renderer.render()
})


export default router;
