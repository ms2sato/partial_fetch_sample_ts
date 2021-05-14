import { PartialRenderer } from "../../lib/partial_renderer";

declare global {
  namespace Express {
    interface Response {
      partials: () => PartialRenderer
    }
  }
}
