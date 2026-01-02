const puppeteer = require('puppeteer');

(async () => {
    // Launch browser (visible mode)
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ['--start-maximized'] // Full screen
    });

    const page = await browser.newPage();

    console.log('🎬 Starting Demo Recording Sequence...');

    // 1. INTRO
    console.log('Step 1: Navigate to Home...');
    await page.goto('https://vibes-music-app-frontend.vercel.app/', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 2000)); // Pause for effect

    // Scroll to Trending
    await page.evaluate(() => {
        window.scrollBy({ top: 600, behavior: 'smooth' });
    });
    await new Promise(r => setTimeout(r, 2000));

    // 2. PLAY MUSIC
    console.log('Step 2: Play "Dance Monkey"...');
    // Click first play button in trending (finding by aria-label or class might be needed, using gentle coordinate click or selector)
    // Assuming the first track card play button
    const playButtons = await page.$$('button');
    // This is a heuristic, in a real app we'd use specific IDs. 
    // Let's try locating the specific text "Dance Monkey" and clicking near it.

    // Alternative: Click the first card image
    await page.mouse.click(300, 500); // Approximate location of first card
    await new Promise(r => setTimeout(r, 5000)); // Wait for visualizer

    // 3. VOLUME CONTROL
    console.log('Step 3: Adjust Volume...');
    // Find volume slider input
    const volInput = await page.$('input[type="range"]');
    if (volInput) {
        await volInput.click();
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('ArrowDown');
        await new Promise(r => setTimeout(r, 500));
        await page.keyboard.press('ArrowUp');
    }

    // 4. PODCASTS
    console.log('Step 4: Go to Podcasts...');
    // Click Sidebar Link with text "Podcasts"
    const links = await page.$$('a');
    for (const link of links) {
        const text = await page.evaluate(el => el.textContent, link);
        if (text.includes('Podcasts')) {
            await link.click();
            break;
        }
    }
    await new Promise(r => setTimeout(r, 3000));

    // 5. RADIO
    console.log('Step 5: Go to Radio...');
    for (const link of links) {
        const text = await page.evaluate(el => el.textContent, link);
        if (text.includes('Radio')) {
            await link.click();
            break;
        }
    }
    await new Promise(r => setTimeout(r, 3000));

    // 6. SEARCH
    console.log('Step 6: Search...');
    for (const link of links) {
        const text = await page.evaluate(el => el.textContent, link);
        if (text.includes('Search')) {
            await link.click();
            break;
        }
    }
    await new Promise(r => setTimeout(r, 1000));
    await page.type('input[type="text"]', 'Pop', { delay: 100 }); // Type slowly
    await new Promise(r => setTimeout(r, 3000));

    console.log('✅ Demo Sequence Complete!');
    // await browser.close(); // Keep open so user can close
})();
