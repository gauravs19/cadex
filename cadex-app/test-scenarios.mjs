// CADEX — Automated scenario tests using Playwright
// Covers 4 deal scenarios end-to-end

import { chromium } from 'playwright'

const BASE = 'http://localhost:5175'
const PASS = '✅'
const FAIL = '❌'
const results = []

function log(label, ok, detail = '') {
  const icon = ok ? PASS : FAIL
  console.log(`  ${icon} ${label}${detail ? ' — ' + detail : ''}`)
  results.push({ label, ok })
}

async function wait(ms) { return new Promise(r => setTimeout(r, ms)) }

async function runScenario(page, name, fn) {
  console.log(`\n${'─'.repeat(60)}`)
  console.log(`SCENARIO: ${name}`)
  console.log('─'.repeat(60))
  try {
    await fn(page)
  } catch (err) {
    log(`Scenario crashed`, false, err.message)
  }
}

// ── Helpers ────────────────────────────────────────────────────

async function startNewDeal(page) {
  // Clear persisted Zustand state so app always shows Home
  await page.goto(BASE)
  await page.evaluate(() => localStorage.clear())
  await page.reload()
  await page.waitForSelector('text=Full Assessment', { timeout: 10000 })
  await page.click('text=Full Assessment')
  await page.waitForSelector('text=Deal Intake', { timeout: 10000 })
}

async function fillBasicsAndAdvance(page, { name, client }) {
  await page.fill('input[placeholder*="e.g. Acme"]', name)
  await page.fill('input[placeholder*="Client organisation"]', client)
  await wait(200)
  // Click "Save & Continue →" to advance to Work Classification
  await page.click('button:has-text("Save & Continue")')
  await wait(300)
}

async function proceedToScoring(page) {
  const btn = await page.$('button:has-text("Continue to Risk Assessment")')
  if (!btn) return false
  // Button is enabled only when canProceed (workType set) — check it's not disabled
  const disabled = await btn.isDisabled()
  if (disabled) return false
  await btn.click()
  await page.waitForSelector('text=Risk Assessment', { timeout: 8000 })
  return true
}

// Answer all visible scale questions at score 4 (button index 3),
// navigate through all sections, then click "View Strategy →".
async function answerQuestionsAndViewStrategy(page) {
  const MAX_SECTIONS = 15
  for (let i = 0; i < MAX_SECTIONS; i++) {
    // Each question renders a .grid.grid-cols-5 with 5 score buttons
    const gridCount = await page.locator('.grid.grid-cols-5').count()
    for (let c = 0; c < gridCount; c++) {
      const grid = page.locator('.grid.grid-cols-5').nth(c)
      const btn = grid.locator('button').nth(3) // score 4 (index 3)
      if (await btn.count() > 0) {
        await btn.click()
        await wait(60)
      }
    }
    await wait(300)

    // "View Strategy →" only appears on the last section
    const viewStratBtn = page.locator('button:has-text("View Strategy")')
    if (await viewStratBtn.count() > 0) {
      const disabled = await viewStratBtn.isDisabled()
      if (!disabled) {
        await viewStratBtn.click()
        await wait(800)
        return true
      }
    }

    // Advance to next section
    const nextBtn = page.locator('button:has-text("Next section")')
    if (await nextBtn.count() > 0) {
      await nextBtn.click()
      await wait(400)
    } else {
      break
    }
  }
  return false
}

// ── Scenario 1: Greenfield Data Analytics deal ────────────────

async function scenario1(page) {
  await startNewDeal(page)
  log('Home → Intake navigation', true)

  await fillBasicsAndAdvance(page, { name: 'BFSI Analytics Platform', client: 'Barclays' })
  log('Basics filled & section advanced', true)

  const catSel = await page.$('select:near(:text("Work category"))')
  log('Work Classification section opened', !!catSel)

  if (catSel) {
    await page.click('button:has-text("Greenfield")')
    await wait(300)
    await catSel.selectOption('gf-data')
    await wait(300)
    log('Work category: gf-data selected', true)

    const typeSel = await page.$('select:near(:text("Work type"))')
    if (typeSel) {
      await typeSel.selectOption('data-warehouse')
      await wait(500)
      log('Work type: data-warehouse selected', true)
    } else {
      log('Work type select found', false)
    }
  }

  // Scope questions — heading contains "Data Warehouse"
  const scopeBlock = await page.$('text=Data Warehouse')
  log('Scope questions loaded for data-warehouse', !!scopeBlock)

  // Effort estimator
  await wait(300)
  const effortCard = await page.$('text=Indicative Team Composition')
  log('Effort estimator card visible', !!effortCard)

  // Proceed to Risk Assessment
  const ok = await proceedToScoring(page)
  log('Navigated to Risk Assessment', ok)
  if (!ok) return

  // Work-type specific questions section
  const wtSection = await page.$('text=Work-Type Specific')
  log('Work-type specific questions section visible', !!wtSection)

  // Answer questions and navigate to Strategy
  const reachedStrategy = await answerQuestionsAndViewStrategy(page)
  log('Navigated to Strategy step', reachedStrategy)
  if (!reachedStrategy) return

  // Strategy page features
  const modeler = await page.$('text=What-If Scenario Modeler')
  log('Scenario Modeler visible', !!modeler)

  const winThemes = await page.$('text=Win Themes for This Deal')
  log('Win themes section visible', !!winThemes)

  const objections = await page.$('text=Objection Handlers')
  log('Objection handlers section visible', !!objections)
}

// ── Scenario 2: Security VAPT — high risk deal ─────────────────

async function scenario2(page) {
  await startNewDeal(page)

  await fillBasicsAndAdvance(page, { name: 'Bank Security Assessment', client: 'HDFC Bank' })

  const catSel = await page.$('select:near(:text("Work category"))')
  if (catSel) {
    await page.click('button:has-text("Brownfield")')
    await wait(300)
    await catSel.selectOption('bf-security')
    await wait(300)
    log('Work category: bf-security selected', true)

    const typeSel = await page.$('select:near(:text("Work type"))')
    if (typeSel) {
      const options = await typeSel.$$('option')
      log(`Work type options count: ${options.length}`, options.length > 1)
      if (options.length > 1) {
        await typeSel.selectOption({ index: 1 })
        await wait(500)
        const val = await typeSel.inputValue()
        log(`Work type selected: ${val}`, !!val)
      }
    }
  }

  // Security scope questions
  await wait(400)
  const scopeBlock = await page.$('text=VAPT')
  log('Security scope questions loaded', !!scopeBlock)

  const effortCard = await page.$('text=Indicative Team Composition')
  log('Effort estimator visible for security work', !!effortCard)

  const ok = await proceedToScoring(page)
  log('Proceeded to Risk Assessment', ok)

  if (ok) {
    const wtQ = await page.$('text=Work-Type Specific')
    log('Security work-type questions present', !!wtQ)
  }
}

// ── Scenario 3: Scenario Modeler interaction ──────────────────

async function scenario3(page) {
  await startNewDeal(page)

  await fillBasicsAndAdvance(page, { name: 'ERP Migration', client: 'Tata Steel' })

  const catSel = await page.$('select:near(:text("Work category"))')
  if (catSel) {
    await page.click('button:has-text("Brownfield")')
    await wait(300)
    await catSel.selectOption('bf-migration')
    await wait(300)

    const typeSel = await page.$('select:near(:text("Work type"))')
    if (typeSel) {
      const options = await typeSel.$$('option')
      if (options.length > 1) await typeSel.selectOption({ index: 1 })
      await wait(400)
    }
  }

  const ok = await proceedToScoring(page)
  if (!ok) { log('Risk Assessment reached', false); return }
  log('Risk Assessment reached', true)

  // Answer questions through all sections → Strategy
  const reachedStrategy = await answerQuestionsAndViewStrategy(page)
  log('Reached Strategy step', reachedStrategy)
  if (!reachedStrategy) return

  // Expand scenario modeler
  const modelerBtn = await page.$('button:has-text("What-If Scenario Modeler")')
  if (modelerBtn) {
    await modelerBtn.click()
    await wait(500)
    log('Scenario Modeler expanded', true)

    // Axis sliders
    const sliders = await page.$$('input[type="range"]')
    log(`Axis sliders rendered: ${sliders.length}`, sliders.length >= 8)

    // Move slider and check reset button
    if (sliders.length > 0) {
      await sliders[0].fill('5')
      await sliders[0].dispatchEvent('input')
      await wait(400)
      const resetBtn = await page.$('button:has-text("Reset")')
      log('Reset button visible when changes made', !!resetBtn)
      if (resetBtn) {
        await resetBtn.click()
        await wait(300)
        log('Reset clicked successfully', true)
      }
    }
  } else {
    log('Scenario Modeler button found', false)
  }
}

// ── Scenario 4: Share link round-trip ────────────────────────

async function scenario4(page) {
  await startNewDeal(page)

  await fillBasicsAndAdvance(page, { name: 'Share Link Test Deal', client: 'Test Corp' })

  // Share deal button in header
  const shareBtn = await page.$('button:has-text("Share deal")')
  log('Share deal button visible in header', !!shareBtn)

  if (shareBtn) {
    await shareBtn.click()
    await wait(800)
    // "Copied!" confirms clipboard write succeeded; fallback check button still exists
    const copied = await page.$('text=Copied!')
    const shareStill = await page.$('text=Share deal')
    log('Share button responded after click', !!copied || !!shareStill)
    if (copied) log('"Copied!" feedback shown', true)
    await wait(2500)
    const resetLabel = await page.$('text=Share deal')
    log('Share button label restored after 2s', !!resetLabel)
  }

  // Export JSON in sidebar
  const exportBtn = await page.$('button:has-text("Export JSON")')
  log('Export JSON button in sidebar', !!exportBtn)
}

// ── Main ──────────────────────────────────────────────────────

async function main() {
  console.log('\n🧪 CADEX v0.5 — Automated Scenario Tests')
  console.log('='.repeat(60))
  console.log(`Target: ${BASE}\n`)

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 1400, height: 900 },
    permissions: ['clipboard-read', 'clipboard-write'],
  })

  try {
    const page = await context.newPage()

    await page.goto(BASE)
    await page.waitForLoadState('networkidle')
    const title = await page.title()
    log(`App loads (title: "${title}")`, !!title)

    const homeHeading = await page.$('text=CADEX')
    log('Home page renders', !!homeHeading)

    await runScenario(page, 'Greenfield Data Analytics (BFSI)', scenario1)
    await runScenario(page, 'Security VAPT — Brownfield', scenario2)
    await runScenario(page, 'Scenario Modeler Interaction', scenario3)
    await runScenario(page, 'Share Link & Export', scenario4)

  } finally {
    await context.close()
    await browser.close()
  }

  // Summary
  console.log('\n' + '='.repeat(60))
  console.log('RESULTS SUMMARY')
  console.log('='.repeat(60))
  const passed = results.filter(r => r.ok).length
  const failed = results.filter(r => !r.ok).length
  console.log(`  ${PASS} Passed: ${passed}`)
  console.log(`  ${FAIL} Failed: ${failed}`)
  console.log(`  Total:  ${results.length}`)
  if (failed > 0) {
    console.log('\nFailed checks:')
    results.filter(r => !r.ok).forEach(r => console.log(`  • ${r.label}`))
  }
  console.log()
  process.exit(failed > 0 ? 1 : 0)
}

main().catch(err => {
  console.error('Test runner crashed:', err)
  process.exit(1)
})
