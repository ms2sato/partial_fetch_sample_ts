import express from "express"
const router = express.Router()

import pug from 'pug'
import path from 'path'
import multer from 'multer'

let titleCounter = 0
const messages: string[] = [
  'テスト1',
  'テスト2'
]

/* GET users listing. */
router.get(
  "/",
  function (
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
    const viewPath = (this.req.app.settings as Record<string, string>).views

    const templatePath = path.join(viewPath, view)
    const html = pug.renderFile(templatePath, options)
    this.ret.partials[selector] = html
  }

  render() {
    this.res.json(this.ret)
  }
}

router.get('/time', function (
  req: express.Request,
  res: express.Response,
  _next: express.NextFunction
) {
  const renderer = new PartialRenderer(req, res)
  renderer.add('#output', '/user/time.pug')
  renderer.render()
})

router.get('/title', function (
  req: express.Request,
  res: express.Response,
  _next: express.NextFunction
) {
  const renderer = new PartialRenderer(req, res)
  renderer.add('#title', '/user/title.pug', { titleCounter: titleCounter++ })
  renderer.render()
})

router.get('/multi', function (
  req: express.Request,
  res: express.Response,
  _next: express.NextFunction
) {
  const renderer = new PartialRenderer(req, res)
  renderer.add('#output', '/user/time.pug')
  renderer.add('#title', '/user/title.pug', { titleCounter: titleCounter++ })
  renderer.render()
})

router.post('/messages', multer({ dest: '/tmp/' }).single('file'), function (
  req: express.Request,
  res: express.Response,
  _next: express.NextFunction
) {
  console.log(req.body)
  console.log(req.params)

  const message = (req.body as Record<string, string>).message
  messages.push(message)

  console.log(message)

  const renderer = new PartialRenderer(req, res)
  renderer.add('ul', '/user/message.pug', { message })
  renderer.add('form', '/user/form.pug')
  renderer.render()
})


export default router;
