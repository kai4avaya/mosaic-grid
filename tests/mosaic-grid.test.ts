// tests/mosaic-grid.test.ts

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MosaicItem } from '../src/types';

// 1. import the component class. this registers the custom element!
import '../src/mosaic-grid';

// 2. define our mock data for all tests
const mockItems: MosaicItem[] = [
  { 
    id: 'img-1', type: 'image', layout: 'big',
    preview: 'preview.jpg', full: 'full.jpg', title: 'test image' 
  },
  { 
    id: 'pdf-1', type: 'pdf', layout: 'tall',
    preview: 'pdf-preview.png', src: 'dummy.pdf', title: 'test pdf'
  },
  { 
    id: 'link-1', type: 'external_link', layout: 'normal',
    preview: 'link-preview.png', url: 'https://google.com', title: 'test link'
  }
];

// --- our test suite ---

describe('MosaicGridWidget component', () => {

  let grid: HTMLElement;

  // 3. --- setup ---
  // before each test, create a fresh component and add it to the dom
  beforeEach(() => {
    // clear the dom from previous tests
    document.body.innerHTML = '';
    
    // create the component
    grid = document.createElement('mosaic-grid-widget');
    
    // add it to the jsdom
    document.body.appendChild(grid);
    
    // set the items data to trigger populateGrid()
    // we use 'as any' to access the .items setter
    (grid as any).items = mockItems;
  });

  // --- teardown ---
  afterEach(() => {
    document.body.innerHTML = '';
  });


  // --- the tests ---

  it('should render the correct number of tiles', () => {
    // 4. we must query the shadow dom
    const tiles = grid.shadowRoot!.querySelectorAll('.grid-wrapper > div');
    
    // verify all 3 mock items were rendered as tiles
    expect(tiles.length).toBe(3);
  });

  it('should render tiles with correct layout classes', () => {
    const bigTile = grid.shadowRoot!.querySelector('[data-id="img-1"]');
    const tallTile = grid.shadowRoot!.querySelector('[data-id="pdf-1"]');

    expect(bigTile!.classList.contains('big')).toBe(true);
    expect(tallTile!.classList.contains('tall')).toBe(true);
  });

  it('should expand an image tile on click', () => {
    const gridWrapper = grid.shadowRoot!.querySelector('.grid-wrapper');
    const imgTile = grid.shadowRoot!.querySelector<HTMLElement>('[data-id="img-1"]')!;
    
    // 5. simulate the click
    imgTile.click();

    // 6. check the results
    expect(gridWrapper!.classList.contains('item-is-expanded')).toBe(true);
    expect(imgTile.classList.contains('expanded')).toBe(true);
    
    // check that the *full* image was injected
    const injectedImg = imgTile.querySelector('img.full-content');
    expect(injectedImg).not.toBeNull();
    expect((injectedImg as HTMLImageElement).src).toContain('full.jpg');
    
    // check that the preview background was removed
    expect(imgTile.style.backgroundImage).toBe('none');
  });

  it('should reset the grid when clicking an expanded tile', () => {
    const gridWrapper = grid.shadowRoot!.querySelector('.grid-wrapper');
    const imgTile = grid.shadowRoot!.querySelector<HTMLElement>('[data-id="img-1"]')!;
    
    // act 1: expand the tile
    imgTile.click();
    expect(imgTile.classList.contains('expanded')).toBe(true); // sanity check

    // act 2: click it again to close
    imgTile.click();

    // assert: check that everything is reset
    expect(gridWrapper!.classList.contains('item-is-expanded')).toBe(false);
    expect(imgTile.classList.contains('expanded')).toBe(false);
    
    // check that injected content is gone
    expect(imgTile.querySelector('img.full-content')).toBeNull();
    
    // check that the preview background was restored
    expect(imgTile.style.backgroundImage).toContain('preview.jpg');
  });

  it('should inject an iframe for a pdf tile on click', () => {
    const pdfTile = grid.shadowRoot!.querySelector<HTMLElement>('[data-id="pdf-1"]')!;
    
    // act
    pdfTile.click();

    // assert
    expect(pdfTile.classList.contains('expanded')).toBe(true);
    
    const injectedIframe = pdfTile.querySelector('iframe.full-content-iframe');
    expect(injectedIframe).not.toBeNull();
    expect((injectedIframe as HTMLIFrameElement).src).toContain('dummy.pdf');
  });

  it('should not expand for an external_link tile', () => {
    // note: we can't test window.open easily without spies,
    // but we can verify the component *did not* expand.
    
    const gridWrapper = grid.shadowRoot!.querySelector('.grid-wrapper');
    const linkTile = grid.shadowRoot!.querySelector<HTMLElement>('[data-id="link-1"]')!;

    // act
    linkTile.click();
    
    // assert
    expect(gridWrapper!.classList.contains('item-is-expanded')).toBe(false);
    expect(linkTile.classList.contains('expanded')).toBe(false);
    expect(linkTile.innerHTML).toBe(''); // no content was injected
  });

  it('should reset the grid when clicking the wrapper background', () => {
    const gridWrapper = grid.shadowRoot!.querySelector<HTMLElement>('.grid-wrapper')!;
    const imgTile = grid.shadowRoot!.querySelector<HTMLElement>('[data-id="img-1"]')!;

    // arrange: expand a tile
    imgTile.click();
    expect(gridWrapper.classList.contains('item-is-expanded')).toBe(true);

    // act: click the wrapper itself (simulating a background click)
    gridWrapper.click();

    // assert: grid is reset
    expect(gridWrapper.classList.contains('item-is-expanded')).toBe(false);
    expect(imgTile.classList.contains('expanded')).toBe(false);
    expect(imgTile.innerHTML).toBe('');
  });

});
