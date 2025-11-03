// tests/mosaic-grid.test.ts

import { describe, it, expect, beforeeach, aftereach } from 'vitest';
import { mosaicitem } from '../src/types';

// 1. import the component class. this registers the custom element!
import '../src/mosaic-grid';

// 2. define our mock data for all tests
const mockitems: mosaicitem[] = [
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

describe('mosaicgridwidget component', () => {

  let grid: htmlelement;

  // 3. --- setup ---
  // before each test, create a fresh component and add it to the dom
  beforeeach(() => {
    // clear the dom from previous tests
    document.body.innerhtml = '';
    
    // create the component
    grid = document.createelement('mosaic-grid-widget');
    
    // add it to the jsdom
    document.body.appendchild(grid);
    
    // set the items data to trigger populategrid()
    // we use 'as any' to access the .items setter
    (grid as any).items = mockitems;
  });

  // --- teardown ---
  aftereach(() => {
    document.body.innerhtml = '';
  });


  // --- the tests ---

  it('should render the correct number of tiles', () => {
    // 4. we must query the shadow dom
    const tiles = grid.shadowroot!.queryselectorall('.grid-wrapper > div');
    
    // verify all 3 mock items were rendered as tiles
    expect(tiles.length).tobe(3);
  });

  it('should render tiles with correct layout classes', () => {
    const bigtile = grid.shadowroot!.queryselector('[data-id="img-1"]');
    const talltile = grid.shadowroot!.queryselector('[data-id="pdf-1"]');

    expect(bigtile!.classlist.contains('big')).tobe(true);
    expect(talltile!.classlist.contains('tall')).tobe(true);
  });

  it('should expand an image tile on click', () => {
    const gridwrapper = grid.shadowroot!.queryselector('.grid-wrapper');
    const imgtile = grid.shadowroot!.queryselector<htmlelement>('[data-id="img-1"]')!;
    
    // 5. simulate the click
    imgtile.click();

    // 6. check the results
    expect(gridwrapper!.classlist.contains('item-is-expanded')).tobe(true);
    expect(imgtile.classlist.contains('expanded')).tobe(true);
    
    // check that the *full* image was injected
    const injectedimg = imgtile.queryselector('img.full-content');
    expect(injectedimg).not.tobenull();
    expect((injectedimg as htmlimageelement).src).tocontain('full.jpg');
    
    // check that the preview background was removed
    expect(imgtile.style.backgroundimage).tobe('none');
  });

  it('should reset the grid when clicking an expanded tile', () => {
    const gridwrapper = grid.shadowroot!.queryselector('.grid-wrapper');
    const imgtile = grid.shadowroot!.queryselector<htmlelement>('[data-id="img-1"]')!;
    
    // act 1: expand the tile
    imgtile.click();
    expect(imgtile.classlist.contains('expanded')).tobe(true); // sanity check

    // act 2: click it again to close
    imgtile.click();

    // assert: check that everything is reset
    expect(gridwrapper!.classlist.contains('item-is-expanded')).tobe(false);
    expect(imgtile.classlist.contains('expanded')).tobe(false);
    
    // check that injected content is gone
    expect(imgtile.queryselector('img.full-content')).tobenull();
    
    // check that the preview background was restored
    expect(imgtile.style.backgroundimage).tocontain('preview.jpg');
  });

  it('should inject an iframe for a pdf tile on click', () => {
    const pdftile = grid.shadowroot!.queryselector<htmlelement>('[data-id="pdf-1"]')!;
    
    // act
    pdftile.click();

    // assert
    expect(pdftile.classlist.contains('expanded')).tobe(true);
    
    const injectediframe = pdftile.queryselector('iframe.full-content-iframe');
    expect(injectediframe).not.tobenull();
    expect((injectediframe as htmliframeelement).src).tocontain('dummy.pdf');
  });

  it('should not expand for an external_link tile', () => {
    // note: we can't test window.open easily without spies,
    // but we can verify the component *did not* expand.
    
    const gridwrapper = grid.shadowroot!.queryselector('.grid-wrapper');
    const linktile = grid.shadowroot!.queryselector<htmlelement>('[data-id="link-1"]')!;

    // act
    linktile.click();
    
    // assert
    expect(gridwrapper!.classlist.contains('item-is-expanded')).tobe(false);
    expect(linktile.classlist.contains('expanded')).tobe(false);
    expect(linktile.innerhtml).tobe(''); // no content was injected
  });

  it('should reset the grid when clicking the wrapper background', () => {
    const gridwrapper = grid.shadowroot!.queryselector<htmlelement>('.grid-wrapper')!;
    const imgtile = grid.shadowroot!.queryselector<htmlelement>('[data-id="img-1"]')!;

    // arrange: expand a tile
    imgtile.click();
    expect(gridwrapper.classlist.contains('item-is-expanded')).tobe(true);

    // act: click the wrapper itself (simulating a background click)
    gridwrapper.click();

    // assert: grid is reset
    expect(gridwrapper.classlist.contains('item-is-expanded')).tobe(false);
    expect(imgtile.classlist.contains('expanded')).tobe(false);
    expect(imgtile.innerhtml).tobe('');
  });

});
