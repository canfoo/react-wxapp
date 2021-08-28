import { inputRoot } from '../common/const'
require(`${inputRoot}/app.config.js`)

interface Config {
    pages: string[],
    window: any
}

export const config: Config = require(`${inputRoot}/app.config.js`)

