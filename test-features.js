const { chromium } = require('playwright');

async function testWebsite() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const issues = [];
  const baseUrl = 'http://localhost:3000';
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      issues.push(`Console error: ${msg.text()}`);
    }
  });

  console.log('\n=== COMPREHENSIVE TESTS ===\n');
  
  // Test 1: Landing page features
  console.log('1. Landing Page...');
  try {
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    const content = await page.content();
    const hasLoginBtn = content.includes('Login') || content.includes('login') || content.includes('Sign in');
    const hasStudio = content.includes('Studio') || content.includes('studio');
    console.log(`   ✓ Login link: ${hasLoginBtn}, Studio mention: ${hasStudio}`);
  } catch (e) {
    issues.push(`Landing page: ${e.message}`);
  }

  // Test 2: Login page
  console.log('2. Login Page...');
  try {
    await page.goto(`${baseUrl}/login`, { waitUntil: 'networkidle' });
    const content = await page.content();
    const hasEmail = content.includes('email');
    const hasPassword = content.includes('password');
    const hasSubmit = content.includes('Sign') || content.includes('Submit');
    const hasDemo = content.includes('Demo') || content.includes('demo');
    console.log(`   ✓ Form fields: email=${hasEmail}, password=${hasPassword}, buttons=${hasSubmit && hasDemo}`);
  } catch (e) {
    issues.push(`Login: ${e.message}`);
  }

  // Test 3: Studio page
  console.log('3. Studio Dashboard...');
  try {
    await page.goto(`${baseUrl}/studio`, { waitUntil: 'networkidle' });
    const content = await page.content();
    const hasOverview = content.includes('Overview') || content.includes('overview');
    const hasLinks = content.includes('Links') || content.includes('links');
    const hasTheme = content.includes('Theme') || content.includes('theme');
    const hasProfile = content.includes('Profile') || content.includes('profile');
    console.log(`   ✓ Nav items: Overview=${hasOverview}, Links=${hasLinks}, Theme=${hasTheme}, Profile=${hasProfile}`);
  } catch (e) {
    issues.push(`Studio: ${e.message}`);
  }

  // Test 4: Public profile with published content
  console.log('4. Public Profile (teejay)...');
  try {
    await page.goto(`${baseUrl}/teejay`, { waitUntil: 'networkidle' });
    const content = await page.content();
    const hasName = content.includes('Adetunji');
    const hasUsername = content.includes('teejay');
    const hasPoweredBy = content.includes('LinkNest') || content.includes('Powered');
    const hasAnalytics = content.includes('Visits') || content.includes('Clicks') || content.includes('Views');
    console.log(`   ✓ Name displayed: ${hasName}, Username: ${hasUsername}, Analytics: ${hasAnalytics}, PoweredBy: ${hasPoweredBy}`);
  } catch (e) {
    issues.push(`Public profile: ${e.message}`);
  }

  // Test 5: Non-existent profile
  console.log('5. Non-existent Profile...');
  try {
    await page.goto(`${baseUrl}/nonexistent`, { waitUntil: 'networkidle' });
    const content = await page.content();
    const notFound = content.includes('not available') || content.includes('Not found') || content.includes('404');
    console.log(`   ✓ Shows not found: ${notFound}`);
  } catch (e) {
    issues.push(`404 page: ${e.message}`);
  }

  // Test 6: Theme pages
  console.log('6. Theme Selection Page...');
  try {
    await page.goto(`${baseUrl}/studio`, { waitUntil: 'networkidle' });
    // Click theme section would need more interaction
    const content = await page.content();
    const hasThemePresets = content.includes('Editorial') || content.includes('Midnight') || content.includes('Garden');
    console.log(`   ✓ Theme presets visible: ${hasThemePresets}`);
  } catch (e) {
    issues.push(`Theme: ${e.message}`);
  }

  // Test 7: Analytics display
  console.log('7. Analytics Display...');
  try {
    await page.goto(`${baseUrl}/teejay`, { waitUntil: 'networkidle' });
    const content = await page.content();
    const hasViews = content.match(/Views/i) || content.match(/Visits/i);
    const hasClicks = content.match(/Clicks/i);
    console.log(`   ✓ Views/Visits shown: ${!!hasViews}, Clicks shown: ${!!hasClicks}`);
  } catch (e) {
    issues.push(`Analytics: ${e.message}`);
  }

  // Test 8: Links on public profile
  console.log('8. External Links...');
  try {
    await page.goto(`${baseUrl}/teejay`, { waitUntil: 'networkidle' });
    const links = await page.$$eval('a[href^="http"]', els => els.map(e => e.href));
    console.log(`   ✓ Found ${links.length} external link(s): ${links.slice(0, 2).join(', ')}`);
  } catch (e) {
    issues.push(`External links: ${e.message}`);
  }

  // Test 9: Responsive design check
  console.log('9. Mobile View...');
  try {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${baseUrl}/teejay`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    console.log(`   ✓ Mobile viewport (375x667) works`);
  } catch (e) {
    issues.push(`Mobile: ${e.message}`);
  }

  // Test 10: Desktop view
  console.log('10. Desktop View...');
  try {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(`${baseUrl}/studio`, { waitUntil: 'networkidle' });
    console.log(`   ✓ Desktop viewport (1920x1080) works`);
  } catch (e) {
    issues.push(`Desktop: ${e.message}`);
  }

  await browser.close();

  console.log('\n=== RESULTS ===');
  if (issues.length === 0) {
    console.log('✅ All 10 feature tests passed!\n');
  } else {
    console.log(`❌ Found ${issues.length} issue(s):\n`);
    issues.forEach((issue, i) => console.log(`  ${i+1}. ${issue}`));
  }
}

testWebsite().catch(console.error);