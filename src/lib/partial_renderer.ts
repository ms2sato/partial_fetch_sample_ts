import express from "express"
import pug from 'pug'
import path from 'path'

class PartialRenderer {
  private req: express.Request
  private res: express.Response
  private ret: Record<string, Record<string, string>>

  constructor(req: express.Request, res: express.Response) {
    this.req = req
    this.res = res
    this.ret = { partials: {} }
  }

  add(selector: string, view: string, options = {}):PartialRenderer {
    const viewPath = (this.req.app.settings as Record<string, string>).views

    const templatePath = path.join(viewPath, view)
    const html = pug.renderFile(templatePath, options)
    this.ret.partials[selector] = html
    return this
  }

  render():void {
    this.res.json(this.ret)
  }
}

function partialRenderer() {
  return (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ):void => {
    // eslint-disable-next-line
    (req as any).partials = () => {
      return new PartialRenderer(req, res)
    }
    next()
  }
}

export { partialRenderer, PartialRenderer }