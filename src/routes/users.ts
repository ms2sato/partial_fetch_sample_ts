import express from "express"
const router = express.Router()

let titleCounter = 0
const messages: string[] = [
  'テスト1',
  'テスト2'
]

/* GET users listing. */
router.get("/", (
  _req: express.Request,
  res: express.Response,
  _next: express.NextFunction,
) => {
  res.render('user', { titleCounter: titleCounter++, messages })
})

router.get('/time', (
  req: express.Request,
  _res: express.Response,
  _next: express.NextFunction
) => {
  req.partials()
    .inner('#output', '/user/time.pug')
    .render()
})

router.get('/title', (
  req: express.Request,
  _res: express.Response,
  _next: express.NextFunction
) => {
  req.partials()
    .replace('#title', '/user/title.pug', { titleCounter: titleCounter++ })
    .render()
})

router.get('/multi', (
  req: express.Request,
  _res: express.Response,
  _next: express.NextFunction
) => {
  req.partials()
    .inner('#output', '/user/time.pug')
    .replace('#title', '/user/title.pug', { titleCounter: titleCounter++ })
    .render()
})

router.post('/messages', (
  req: express.Request,
  _res: express.Response,
  _next: express.NextFunction
) => {
  const message = (req.body as Record<string, string>).message
  const partials = req.partials()
  if (!message || message.length === 0) {
    return partials
      .replace('form', '/user/form.pug', {
        message, err: { errors: [{ message: 'メッセージは必須です' }] }
      })
      .render()
  }

  messages.push(message)

  partials
    .appendChild('ul.messages', '/user/message.pug', { message })
    .replace('form', '/user/form.pug')
    .render()
})

export default router;
