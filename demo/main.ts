
// demo/main.ts

// 1. Import the component class. This "registers" the custom element.
import '../src/mosaic-grid'; 

// 2. Import the types
import { MosaicItem, CustomItem } from '../src/types';

// 3. Beautiful landscape and nature images (inspired by original design)
const demoItems: MosaicItem[] = [
    // Original images from the initial design
    { id: '1', type: 'image', layout: 'normal',
      preview: 'https://images.unsplash.com/photo-1541845157-a6d2d100c931?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
      full: 'https://images.unsplash.com/photo-1541845157-a6d2d100c931?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2000&q=80' },
    { id: '2', type: 'image', layout: 'normal',
      preview: 'https://images.unsplash.com/photo-1588282322673-c31965a75c3e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1351&q=80',
      full: 'https://images.unsplash.com/photo-1588282322673-c31965a75c3e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2000&q=80' },
    { id: '3', type: 'image', layout: 'tall',
      preview: 'https://images.unsplash.com/photo-1588117472013-59bb13edafec?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
      full: 'https://images.unsplash.com/photo-1588117472013-59bb13edafec?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2000&q=80' },
    { id: '4', type: 'image', layout: 'wide',
      preview: 'https://images.unsplash.com/photo-1587588354456-ae376af71a25?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
      full: 'https://images.unsplash.com/photo-1587588354456-ae376af71a25?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2000&q=80' },
    { id: '5', type: 'image', layout: 'normal',
      preview: 'https://images.unsplash.com/photo-1558980663-3685c1d673c4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=60',
      full: 'https://images.unsplash.com/photo-1558980663-3685c1d673c4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2000&q=80' },
    { id: '6', type: 'image', layout: 'tall',
      preview: 'https://images.unsplash.com/photo-1588499756884-d72584d84df5?ixlib=rb-1.2.1&auto=format&fit=crop&w=2134&q=80',
      full: 'https://images.unsplash.com/photo-1588499756884-d72584d84df5?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80' },
    { id: '7', type: 'image', layout: 'big',
      preview: 'https://images.unsplash.com/photo-1588492885706-b8917f06df77?ixlib=rb-1.2.1&auto=format&fit=crop&w=1951&q=80',
      full: 'https://images.unsplash.com/photo-1588492885706-b8917f06df77?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80' },
    { id: '8', type: 'image', layout: 'normal',
      preview: 'https://images.unsplash.com/photo-1588247866001-68fa8c438dd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=564&q=80',
      full: 'https://images.unsplash.com/photo-1588247866001-68fa8c438dd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80' },
    { id: '9', type: 'image', layout: 'wide',
      preview: 'https://images.unsplash.com/photo-1586521995568-39abaa0c2311?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
      full: 'https://images.unsplash.com/photo-1586521995568-39abaa0c2311?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2000&q=80' },
    { id: '10', type: 'image', layout: 'big',
      preview: 'https://images.unsplash.com/photo-1572914857229-37bf6ee8101c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1951&q=80',
      full: 'https://images.unsplash.com/photo-1572914857229-37bf6ee8101c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2000&q=80' },
    { id: '11', type: 'image', layout: 'tall',
      preview: 'https://images.unsplash.com/photo-1588453862014-cd1a9ad06a12?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80',
      full: 'https://images.unsplash.com/photo-1588453862014-cd1a9ad06a12?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2000&q=80' },
    { id: '12', type: 'image', layout: 'normal',
      preview: 'https://images.unsplash.com/photo-1588414734732-660b07304ddb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=675&q=80',
      full: 'https://images.unsplash.com/photo-1588414734732-660b07304ddb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2000&q=80' },
    { id: '13', type: 'image', layout: 'normal',
      preview: 'https://images.unsplash.com/photo-1588224575346-501f5880ef29?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=80',
      full: 'https://images.unsplash.com/photo-1588224575346-501f5880ef29?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2000&q=80' },
    { id: '14', type: 'image', layout: 'normal',
      preview: 'https://images.unsplash.com/photo-1574798834926-b39501d8eda2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
      full: 'https://images.unsplash.com/photo-1574798834926-b39501d8eda2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2000&q=80' },
    { id: '15', type: 'image', layout: 'normal',
      preview: 'https://images.unsplash.com/photo-1547234935-80c7145ec969?ixlib=rb-1.2.1&auto=format&fit=crop&w=1353&q=80',
      full: 'https://images.unsplash.com/photo-1547234935-80c7145ec969?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80' },
    { id: '16', type: 'image', layout: 'wide',
      preview: 'https://images.unsplash.com/photo-1588263823647-ce3546d42bfe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=675&q=80',
      full: 'https://images.unsplash.com/photo-1588263823647-ce3546d42bfe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2000&q=80' },
    { id: '17', type: 'image', layout: 'normal',
      preview: 'https://images.unsplash.com/photo-1587732608058-5ccfedd3ea63?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
      full: 'https://images.unsplash.com/photo-1587732608058-5ccfedd3ea63?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2000&q=80' },
    { id: '18', type: 'image', layout: 'normal',
      preview: 'https://images.unsplash.com/photo-1587897773780-fe72528d5081?ixlib=rb-1.2.1&auto=format&fit=crop&w=1489&q=80',
      full: 'https://images.unsplash.com/photo-1587897773780-fe72528d5081?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80' },
    { id: '19', type: 'image', layout: 'wide',
      preview: 'https://images.unsplash.com/photo-1588083949404-c4f1ed1323b3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1489&q=80',
      full: 'https://images.unsplash.com/photo-1588083949404-c4f1ed1323b3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2000&q=80' },
    { id: '20', type: 'image', layout: 'normal',
      preview: 'https://images.unsplash.com/photo-1587572236558-a3751c6d42c0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
      full: 'https://images.unsplash.com/photo-1587572236558-a3751c6d42c0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2000&q=80' },
    { id: '21', type: 'image', layout: 'wide',
      preview: 'https://images.unsplash.com/photo-1583542225715-473a32c9b0ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
      full: 'https://images.unsplash.com/photo-1583542225715-473a32c9b0ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2000&q=80' },
    { id: '22', type: 'image', layout: 'big',
      preview: 'https://images.unsplash.com/photo-1527928159272-7d012024eb74?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
      full: 'https://images.unsplash.com/photo-1527928159272-7d012024eb74?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2000&q=80' },
    { id: '23', type: 'image', layout: 'normal',
      preview: 'https://images.unsplash.com/photo-1553984840-b8cbc34f5215?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
      full: 'https://images.unsplash.com/photo-1553984840-b8cbc34f5215?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2000&q=80' },
    { id: '24', type: 'image', layout: 'normal',
      preview: 'https://images.unsplash.com/photo-1433446787703-42d5bf446876?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1351&q=80',
      full: 'https://images.unsplash.com/photo-1433446787703-42d5bf446876?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2000&q=80' },
    { id: '25', type: 'image', layout: 'tall',
      preview: 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80',
      full: 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2000&q=80' },
    { id: '26', type: 'image', layout: 'normal',
      preview: 'https://images.unsplash.com/photo-1421930866250-aa0594cea05c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1355&q=80',
      full: 'https://images.unsplash.com/photo-1421930866250-aa0594cea05c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2000&q=80' },
    { id: '27', type: 'image', layout: 'normal',
      preview: 'https://images.unsplash.com/photo-1493306454986-c8877a09cbeb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1381&q=80',
      full: 'https://images.unsplash.com/photo-1493306454986-c8877a09cbeb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2000&q=80' },
    { id: '28', type: 'image', layout: 'wide',
      preview: 'https://images.unsplash.com/photo-1536466528142-f752ae7bdd0c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
      full: 'https://images.unsplash.com/photo-1536466528142-f752ae7bdd0c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2000&q=80' },
    { id: '29', type: 'image', layout: 'big',
      preview: 'https://images.unsplash.com/photo-1541187714594-731deadcd16a?ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=80',
      full: 'https://images.unsplash.com/photo-1541187714594-731deadcd16a?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80' },

    // --- Additional Nature Images ---
    { id: '40', type: 'image', layout: 'normal',
      preview: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
      full: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2000&q=80' },
    { id: '41', type: 'image', layout: 'wide',
      preview: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80',
      full: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=2000&q=80' },
    { id: '42', type: 'image', layout: 'tall',
      preview: 'https://images.unsplash.com/photo-1464822759844-d150ad279bfd?w=600&q=80',
      full: 'https://images.unsplash.com/photo-1464822759844-d150ad279bfd?w=2000&q=80' },
    { id: '43', type: 'image', layout: 'normal',
      preview: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&q=80',
      full: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=2000&q=80' },
    { id: '44', type: 'image', layout: 'normal',
      preview: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&q=80',
      full: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=2000&q=80' },
    { id: '45', type: 'image', layout: 'wide',
      preview: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80',
      full: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=2000&q=80' },
    { id: '46', type: 'image', layout: 'tall',
      preview: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80',
      full: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=2000&q=80' },
    { id: '47', type: 'image', layout: 'normal',
      preview: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=800&q=80',
      full: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=2000&q=80' },
    { id: '48', type: 'image', layout: 'big',
      preview: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80',
      full: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=2000&q=80' },
    { id: '49', type: 'image', layout: 'wide',
      preview: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80',
      full: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=2000&q=80' },
    { id: '50', type: 'image', layout: 'normal',
      preview: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&q=80',
      full: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=2000&q=80' },
    { id: '51', type: 'image', layout: 'tall',
      preview: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&q=80',
      full: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=2000&q=80' },
    { id: '52', type: 'image', layout: 'wide',
      preview: 'https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?w=800&q=80',
      full: 'https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?w=2000&q=80' },
    { id: '53', type: 'image', layout: 'normal',
      preview: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80',
      full: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=2000&q=80' },
    { id: '54', type: 'image', layout: 'big',
      preview: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80',
      full: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=2000&q=80' },
    { id: '55', type: 'image', layout: 'normal',
      preview: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&q=80',
      full: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=2000&q=80' },
    { id: '56', type: 'image', layout: 'wide',
      preview: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
      full: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=2000&q=80' },
    { id: '57', type: 'image', layout: 'tall',
      preview: 'https://images.unsplash.com/photo-1511207538754-e8555f2bc187?w=600&q=80',
      full: 'https://images.unsplash.com/photo-1511207538754-e8555f2bc187?w=2000&q=80' },
    { id: '58', type: 'image', layout: 'normal',
      preview: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=800&q=80',
      full: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=2000&q=80' },
    { id: '59', type: 'image', layout: 'normal',
      preview: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80',
      full: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=2000&q=80' },
    { id: '60', type: 'image', layout: 'big',
      preview: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&q=80',
      full: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=2000&q=80' },
    { id: '61', type: 'image', layout: 'wide',
      preview: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
      full: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=2000&q=80' },
    { id: '62', type: 'image', layout: 'normal',
      preview: 'https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?w=800&q=80',
      full: 'https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?w=2000&q=80' },
    { id: '63', type: 'image', layout: 'tall',
      preview: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600&q=80',
      full: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=2000&q=80' },
    { id: '64', type: 'image', layout: 'normal',
      preview: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
      full: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=2000&q=80' },
    { id: '65', type: 'image', layout: 'wide',
      preview: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=800&q=80',
      full: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=2000&q=80' },
    { id: '66', type: 'image', layout: 'normal',
      preview: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&q=80',
      full: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=2000&q=80' },
    { id: '67', type: 'image', layout: 'big',
      preview: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80',
      full: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=2000&q=80' },
    { id: '68', type: 'image', layout: 'tall',
      preview: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80',
      full: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=2000&q=80' },
    { id: '69', type: 'image', layout: 'normal',
      preview: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&q=80',
      full: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=2000&q=80' },

    // --- Document Examples ---
    { id: '31', type: 'pdf', layout: 'tall',
      preview: 'https://via.placeholder.com/400x600/4A90E2/FFFFFF?text=PDF',
      src: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      title: 'Sample PDF Document' },
    { id: '32', type: 'markdown', layout: 'normal',
      preview: 'https://via.placeholder.com/400x400/50C878/FFFFFF?text=Markdown',
      src: 'https://raw.githubusercontent.com/google/g-colab-extras/master/README.md',
      title: 'Sample Markdown File' },

    // --- Add New Tile ---
    { 
        id: 'add-new', 
        type: 'custom', 
        layout: 'normal',
        preview: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"><rect fill="transparent"/></svg>',
        previewHtml: `
            <div style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                overflow: hidden;
            ">
                <div style="
                    position: absolute;
                    width: 200%;
                    height: 200%;
                    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
                    animation: shimmer 3s ease-in-out infinite;
                "></div>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="position: relative; z-index: 1; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <style>
                    @keyframes shimmer {
                        0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
                        50% { transform: translate(-50%, -50%) rotate(180deg); }
                    }
                </style>
            </div>
        `,
        handler: async () => {
            // Immediately show modal and reset grid
            if (gridElement) {
                // Reset any expanded tile
                (gridElement as any).resetGrid?.();
            }
            // Small delay to ensure grid resets before showing modal
            setTimeout(() => {
                showAddImageModal();
            }, 50);
            return '<div class="markdown-body">Opening add image dialog...</div>';
        }
    } as CustomItem,
];


// 4. Find the component and give it the data
let currentItems: MosaicItem[] = [...demoItems];
let gridElement: any = null;

document.addEventListener('DOMContentLoaded', () => {
  gridElement = document.querySelector('mosaic-grid-widget');
  if (gridElement) {
    gridElement.items = currentItems;
  }
  
  // Create modal HTML
  createAddImageModal();
});

// Function to show the add image modal
function showAddImageModal() {
  const modal = document.getElementById('add-image-modal');
  const overlay = document.getElementById('modal-overlay');
  if (modal && overlay) {
    overlay.style.display = 'flex';
    modal.style.display = 'block';
    const input = document.getElementById('image-url-input') as HTMLInputElement;
    if (input) {
      input.value = '';
      input.focus();
    }
  }
}

// Function to hide the modal
function hideAddImageModal() {
  const modal = document.getElementById('add-image-modal');
  const overlay = document.getElementById('modal-overlay');
  if (modal && overlay) {
    overlay.style.display = 'none';
    modal.style.display = 'none';
  }
}

// Function to add new image to the grid
function addImageToGrid(imageUrl: string) {
  if (!imageUrl || !imageUrl.trim()) {
    alert('Please enter a valid image URL');
    return;
  }

  // Generate unique ID
  const newId = `img-${Date.now()}`;
  
  // Create new image item
  const newItem: MosaicItem = {
    id: newId,
    type: 'image',
    layout: 'normal',
    preview: imageUrl,
    full: imageUrl,
    title: 'New Image'
  };

  // Insert before the add-new tile (keep it at the end)
  const addNewIndex = currentItems.findIndex(item => item.id === 'add-new');
  if (addNewIndex > -1) {
    currentItems.splice(addNewIndex, 0, newItem);
  } else {
    currentItems.push(newItem);
  }

  // Update grid
  if (gridElement) {
    gridElement.items = currentItems;
  }

  // Hide modal
  hideAddImageModal();
}

// Create modal HTML and styles
function createAddImageModal() {
  // Create overlay
  const overlay = document.createElement('div');
  overlay.id = 'modal-overlay';
  overlay.style.cssText = `
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(4px);
    z-index: 10000;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.2s ease-out;
  `;

  // Create modal
  const modal = document.createElement('div');
  modal.id = 'add-image-modal';
  modal.style.cssText = `
    display: none;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    border-radius: 16px;
    padding: 32px;
    max-width: 500px;
    width: 90%;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    animation: slideUp 0.3s ease-out;
    border: 1px solid rgba(255, 255, 255, 0.1);
  `;

  modal.innerHTML = `
    <h2 style="
      color: white;
      margin: 0 0 24px 0;
      font-size: 24px;
      font-weight: 600;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    ">Add New Image</h2>
    
    <label for="image-url-input" style="
      display: block;
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: 8px;
      font-size: 14px;
    ">Image URL</label>
    
    <input 
      type="url" 
      id="image-url-input" 
      placeholder="https://example.com/image.jpg"
      style="
        width: 100%;
        padding: 12px 16px;
        border: 2px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.05);
        color: white;
        font-size: 16px;
        margin-bottom: 24px;
        transition: border-color 0.2s;
        box-sizing: border-box;
      "
      onfocus="this.style.borderColor='rgba(102, 126, 234, 0.5)'"
      onblur="this.style.borderColor='rgba(255, 255, 255, 0.1)'"
      onkeydown="if(event.key === 'Enter') { document.getElementById('add-btn').click(); }"
    />
    
    <div style="display: flex; gap: 12px; justify-content: flex-end;">
      <button 
        id="cancel-btn"
        style="
          padding: 12px 24px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          background: transparent;
          color: rgba(255, 255, 255, 0.8);
          font-size: 16px;
          cursor: pointer;
          transition: all 0.2s;
        "
        onmouseover="this.style.borderColor='rgba(255, 255, 255, 0.4)'; this.style.color='white'"
        onmouseout="this.style.borderColor='rgba(255, 255, 255, 0.2)'; this.style.color='rgba(255, 255, 255, 0.8)'"
      >Cancel</button>
      
      <button 
        id="add-btn"
        style="
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        "
        onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 16px rgba(102, 126, 234, 0.6)'"
        onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(102, 126, 234, 0.4)'"
      >Add Image</button>
    </div>
  `;

  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes slideUp {
      from { 
        opacity: 0;
        transform: translateY(20px);
      }
      to { 
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    #image-url-input::placeholder {
      color: rgba(255, 255, 255, 0.4);
    }
    
    #image-url-input:focus {
      outline: none;
    }
  `;
  document.head.appendChild(style);

  // Event listeners
  modal.querySelector('#cancel-btn')?.addEventListener('click', hideAddImageModal);
  modal.querySelector('#add-btn')?.addEventListener('click', () => {
    const input = document.getElementById('image-url-input') as HTMLInputElement;
    if (input) {
      addImageToGrid(input.value);
    }
  });

  // Close on overlay click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      hideAddImageModal();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const overlay = document.getElementById('modal-overlay');
      if (overlay && overlay.style.display === 'flex') {
        hideAddImageModal();
      }
    }
  });

  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}
