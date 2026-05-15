import { defineConfig } from 'cypress'
import dotenv from 'dotenv'
import fs from 'node:fs'
import path from 'node:path'

dotenv.config()

type DownloadedFileInfo = {
  fileName: string
  absolutePath: string
  size: number
  modifiedAt: number
}

type PdfAuditEntry = {
  context: string
  url: string
  statusCode: number
  contentType: string
  fileName: string
  requestId: string
  timestamp: string
}

export default defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL,
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    downloadsFolder: 'cypress/downloads',
    video: true,
    screenshotOnRunFailure: true,
    viewportWidth: 1440,
    viewportHeight: 900,
    defaultCommandTimeout: 12000,
    requestTimeout: 20000,
    responseTimeout: 30000,
    chromeWebSecurity: false,
    setupNodeEvents(on) {
      on('task', {
        getLatestDownloadedFile(downloadsFolder: string): DownloadedFileInfo | null {
          if (!fs.existsSync(downloadsFolder)) {
            return null
          }

          const files = fs
            .readdirSync(downloadsFolder)
            .map((fileName) => {
              const absolutePath = path.join(downloadsFolder, fileName)
              const stat = fs.statSync(absolutePath)

              return {
                fileName,
                absolutePath,
                size: stat.size,
                modifiedAt: stat.mtimeMs,
              }
            })
            .filter((file) => file.size > 0)
            .sort((a, b) => b.modifiedAt - a.modifiedAt)

          return files[0] ?? null
        },

        readPdfSignature(filePath: string): string | null {
          if (!fs.existsSync(filePath)) {
            return null
          }

          const fd = fs.openSync(filePath, 'r')
          const buffer = Buffer.alloc(5)

          try {
            fs.readSync(fd, buffer, 0, 5, 0)
            return buffer.toString('ascii')
          } finally {
            fs.closeSync(fd)
          }
        },

        ensureDirExists(dirPath: string): null {
          fs.mkdirSync(dirPath, { recursive: true })
          return null
        },

        appendPdfAudit(entry: PdfAuditEntry): null {
          const auditDir = path.join(process.cwd(), 'cypress', 'reports', 'audit')
          fs.mkdirSync(auditDir, { recursive: true })

          const auditPath = path.join(auditDir, 'pdf-audit.jsonl')
          fs.appendFileSync(auditPath, `${JSON.stringify(entry)}\n`, { encoding: 'utf8' })
          return null
        },
      })

      return
    },
  },

  retries: {
    runMode: 1,
    openMode: 0,
  },

  env: {
    USER_EMAIL: process.env.CYPRESS_USER_EMAIL,
    USER_PASSWORD: process.env.CYPRESS_USER_PASSWORD,
  },
})
