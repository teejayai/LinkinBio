const { chromium } = require('playwright');

async function testWebsite() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const issues = [];
  const baseUrl = 'http://localhost:3000';
  
  // Collect console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      issues.push(`Console error on ${page.url()}: ${msg.text()}`);
    }
  });
  
  page.on('pageerror', err => {
    issues.push(`Page error: ${err.message}`);
  });

  console.log('Testing Landing Page...');
  try {
    await page.goto(baseUrl, { waitUntil: 'networkidle', timeout: 10000 });
    const title = await page.title();
    console.log(`  ✓ Landing page loaded: "${title}"`);
  } catch (e) {
    issues.push(`Landing page failed: ${e.message}`);
  }

  console.log('Testing Login Page...');
  try {
    await page.goto(`${baseUrl}/login`, { waitUntil: 'networkidle', timeout: 10000 });
    const emailInput = await page.$('input[type="email"]');
    const passwordInput = await page.$('input[type="password"]');
    const submitBtn = await page.$('button[type="submit"]');
    if (emailInput && passwordInput && submitBtn) {
      console.log('  ✓ Login form elements present');
    } else {
      issues.push('Login page: Missing form elements');
    }
  } catch (e) {
    issues.push(`Login page failed: ${e.message}`);
  }

  console.log('Testing Studio Dashboard...');
  try {
    await page.goto(`${baseUrl}/studio`, { waitUntil: 'networkidle', timeout: 10000 });
    const studioContent = await page.content();
    if (studioContent.includes('LinkNest') || studioContent.includes('studio')) {
      console.log('  ✓ Studio page loaded');
    } else {
      issues.push('Studio page: Unexpected content');
    }
  } catch (e) {
    issues.push(`Studio page failed: ${e.message}`);
  }

  console.log('Testing Public Profile (teejay)...');
  try {
    await page.goto(`${baseUrl}/teejay`, { waitUntil: 'networkidle', timeout: 10000 });
    const profileContent = await page.content();
    if (profileContent.includes('Adetunji') || profileContent.includes('teejay')) {
      console.log('  ✓ Public profile loaded');
    } else {
      issues.push('Public profile: Content not found');
    }
    // Check for links
    const links = await page.$$('a[href^="http"]');
    console.log(`  ✓ Found ${links.length} external links`);
  } catch (e) {
    issues.push(`Public profile failed: ${e.message}`);
  }

  console.log('Testing Non-existent Profile...');
  try {
    await page.goto(`${baseUrl}/nonexistentuser123`, { waitUntil: 'networkidle', timeout: 10000 });
    const content = await page.content();
    if (content.includes('not available') || content.includes('Not found')) {
      console.log('  ✓ 404 page shows proper message');
    } else {
      issues.push('Non-existent profile: Should show not found message');
    }
  } catch (e) {
    issues.push(`404 page failed: ${e.message}`);
  }

  await browser.close();

  console.log('\n=== TEST RESULTS ===');
  if (issues.length === 0) {
    console.log('✅ All tests passed! No issues found.');
  } else {
    console.log(`❌ Found ${issues.length} issue(s):`);
    issues.forEach((issue, i) => console.log(`  ${i+1}. ${issue}`));
  }
  
  return issues;
}

testWebsite().catch(console.error);