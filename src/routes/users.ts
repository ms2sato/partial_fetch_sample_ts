import express from "express"
const router = express.Router()

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

router.get('/time', function (
  req: express.Request,
  _res: express.Response,
  _next: express.NextFunction
) {
  req.partials()
    .add('#output', '/user/time.pug')
    .render()
})

router.get('/title', function (
  req: express.Request,
  _res: express.Response,
  _next: express.NextFunction
) {
  req.partials()
    .add('#title', '/user/title.pug', { titleCounter: titleCounter++ })
    .render()
})

router.get('/multi', function (
  req: express.Request,
  _res: express.Response,
  _next: express.NextFunction
) {
  req.partials()
    .add('#output', '/user/time.pug')
    .add('#title', '/user/title.pug', { titleCounter: titleCounter++ })
    .render()
})

router.post('/messages', function (
  req: express.Request,
  _res: express.Response,
  _next: express.NextFunction
) {
  const message = (req.body as Record<string, string>).message
  const partials = req.partials()
  if(!message || message.length === 0) {
    return partials
      .add('form', '/user/form.pug', { 
        message, err: { errors: [{ message: 'メッセージが空です' }] } 
      })
      .render()
  }

  messages.push(message)

  partials
    .add('ul.messages', '/user/message.pug', { message })
    .add('form', '/user/form.pug')
    .render()
})

export default router;
