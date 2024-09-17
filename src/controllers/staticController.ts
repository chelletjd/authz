import path from "path"
import { defaultConfig, RouteRegistrator } from "../pkg"
import sdk from "../pkg/sdk"
import {
  defaultLightTheme,
  RegisterOryElementsExpress,
} from "@ory/elements-markup"
import express from "express"

export const registerStaticRoutes: RouteRegistrator = (
  app,
  createHelpers = defaultConfig,
) => {
  RegisterOryElementsExpress(app, defaultLightTheme, createHelpers)
  console.log(path.resolve(__dirname,"../../public"))
  app.use("/", express.static(path.resolve(__dirname,"../../public")))
  app.use("/.well-known/ory/webauthn.js", (req, res) => {
    res.contentType("text/javascript")
    sdk.frontend.getWebAuthnJavaScript().then(({ data }) => {
      res.send(data)
    })
  })
  app.use("/", express.static("node_modules/@ory/elements-markup/dist/"))
}
