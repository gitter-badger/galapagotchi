import createLnRpc, { LnRpc, LnRpcClientConfig } from "@radar/lnrpc"
import bodyParser from "body-parser"
import dotenv from "dotenv"
import express from "express"
import morgan from "morgan"
import { homedir } from "os"
import { join } from "path"

import { createRouter } from "./src/router"
import { LevelDBFlashStore } from "./src/store"


async function connectToLnRpc(): Promise<LnRpc> {
    const lnRpcHost = process.env.LNRPC_REMOTE_HOST
    let config: LnRpcClientConfig
    if (!lnRpcHost) {
        const lnRpcNetwork = process.env.LNRPC_NETWORK || "testnet"
        config = {
            server: "localhost:10009",
            macaroonPath: join(homedir(), `/.lnd/data/chain/bitcoin/${lnRpcNetwork}/admin.macaroon`),
        }
    } else {
        config = {
            server: `${lnRpcHost}:10009`,
            tls: `./secret/${lnRpcHost}/tls.cert`,
            macaroonPath: `./secret/${lnRpcHost}/admin.macaroon`,
        }
    }
    console.log(`Connecting to LN RPC with config: ${JSON.stringify(config, undefined, 2)}`)
    return createLnRpc(config)
}

async function run(listenPort: number): Promise<void> {
    const db = new LevelDBFlashStore(__dirname + "/data/galapagotchi.db")

    const lnRpc = await connectToLnRpc()

    const app = express()

    app.use(bodyParser())

    app.use(morgan("short"))

    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*")
        res.header("Access-Control-Allow-Methods", "GET, POST")
        res.header("Access-Control-Allow-Headers", "Content-Type")
        next()
    })

    app.use("/api", createRouter(lnRpc, db))

    return new Promise<void>(
        resolve => app.listen(listenPort, resolve),
    )
}

dotenv.load()
const port = parseInt(process.env.PORT || "8000", 10)
run(port)
    .then(() => console.log(`Listening on port: ${port}`))
