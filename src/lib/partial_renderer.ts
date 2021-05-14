import express from "express"
import pug from 'pug'
import path from 'path'
import { Protocol } from './protocols'

export const ContentType = 'application/partial+json'

class PartialRenderer {
  private req: express.Request
  private res: express.Response
  private ret: Protocol

  constructor(req: express.Request, res: express.Response) {
    this.req = req
    this.res = res
    this.ret = { effects: {} }
  }

  add(selector: string, action: string, view: string, options = {}): PartialRenderer {
    const viewPath = (this.req.app.settings as Record<string, string>).views

    const templatePath = path.join(viewPath, view)
    const html = pug.renderFile(templatePath, options)
    this.ret.effects[selector] = { html, action }
    return this
  }

  inner(selector: string, view: string, options = {}): PartialRenderer {
    return this.add(selector, 'inner', view, options);
  }

  appendChild(selector: string, view: string, options = {}): PartialRenderer {
    return this.add(selector, 'appendChild', view, options);
  }

  prependChild(selector: string, view: string, _options = {}): PartialRenderer {
    throw new Error('Unimplemented')
  }

  insertBefore(selector: string, view: string, _options = {}): PartialRenderer {
    throw new Error('Unimplemented')
  }

  remove(selector: string, view: string, _options = {}): PartialRenderer {
    throw new Error('Unimplemented')
  }

  replace(selector: string, view: string, options = {}): PartialRenderer {
    return this.add(selector, 'replace', view, options);
  }

  send(): void {
    this.res.set('Content-Type', ContentType)
    this.res.json(this.ret)
  }
}

function partialRenderer(): express.RequestHandler {
  return (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): void => {
    // eslint-disable-next-line
    (req as any).partials = () => {
      return new PartialRenderer(req, res)
    }
    next()
  }
}

export { partialRenderer, PartialRenderer }