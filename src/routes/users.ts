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
  res: express.Response
) => {
  res.render('user', { titleCounter: titleCounter++, messages })
})

router.get('/time', (
  req: express.Request,
  res: express.Response
) => {
  res.partials()
    .inner('#output', '/user/time.pug')
    .send()
})

router.get('/title', (
  req: express.Request,
  res: express.Response
) => {
  res.partials()
    .replace('#title', '/user/title.pug', { titleCounter: titleCounter++ })
    .send()
})

router.get('/multi', (
  req: express.Request,
  res: express.Response
) => {
  res.partials()
    .inner('#output', '/user/time.pug')
    .replace('#title', '/user/title.pug', { titleCounter: titleCounter++ })
    .send()
})

router.post('/messages', (
  req: express.Request,
  res: express.Response
) => {
  const message = (req.body as Record<string, string>).message
  if (!message || message.length === 0) {
    return res.partials()
      .replace('form', '/user/form.pug', {
        message, err: { errors: [{ message: 'メッセージは必須です' }] }
      })
      .send()
  }

  messages.push(message)

  // return res.redirect('/users')

  res.partials()
    .appendChild('ul.messages', '/user/message.pug', { message })
    .replace('form', '/user/form.pug')
    .send()
})

export default router;
