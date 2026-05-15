import { mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { merge } from 'mochawesome-merge'
import marge from 'mochawesome-report-generator'

const mergedDir = resolve('cypress/reports/merged')
const htmlDir = resolve('cypress/reports/html')

await mkdir(mergedDir, { recursive: true })
await mkdir(htmlDir, { recursive: true })

const mergedJsonPath = resolve(mergedDir, 'mochawesome.json')

const report = await merge({
  files: ['cypress/reports/mochawesome/*.json'],
})

await marge.create(report, {
  reportDir: htmlDir,
  reportFilename: 'index',
  saveJson: true,
  saveHtml: true,
  charts: true,
  inlineAssets: true,
})

if (!existsSync(mergedJsonPath)) {
  console.log('Relatorio consolidado gerado em cypress/reports/html/index.html')
} else {
  console.log('Relatorio consolidado gerado em cypress/reports/html/index.html e cypress/reports/merged/mochawesome.json')
}
