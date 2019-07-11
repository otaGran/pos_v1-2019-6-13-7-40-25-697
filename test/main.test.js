'use strict';
const printReceipt = require('../main/main.js').printReceipt


const splitTag = require('../main/main.js').splitTag
const isAllBarcodeValid = require('../main/main.js').isAllBarcodeValid

const isBarcodeValid = require('../main/main.js').isBarcodeValid
const dereplication = require('../main/main.js').dereplication
const normalizeTag = require('../main/main.js').normalizeTag
const fillReceipt = require('../main/main.js').fillReceipt
const calculateTolPrice = require('../main/main.js').calculateTolPrice
const calculateTotalDiscount = require('../main/main.js').calculateTotalDiscount

describe('pos', () => {

  it('should print text', () => {

    const tags = [
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000003-2.5',
      'ITEM000005',
      'ITEM000005-2',
    ];

    spyOn(console, 'log');

    printReceipt(tags);

    const expectText = `***<没钱赚商店>收据***
名称：雪碧，数量：5瓶，单价：3.00(元)，小计：12.00(元)
名称：荔枝，数量：2.5斤，单价：15.00(元)，小计：37.50(元)
名称：方便面，数量：3袋，单价：4.50(元)，小计：9.00(元)
----------------------
总计：58.50(元)
节省：7.50(元)
**********************`;

    expect(console.log).toHaveBeenCalledWith(expectText);
  });
});



//isAllBarcodeValid
it('should return false when barcode is ITEM000001-10.2', ()=>{
  expect(isAllBarcodeValid(['ITEM000001-10.2','ITEM000067-10.2'])).toStrictEqual(false );
})



//isBarcodeValid
it('should return false when barcode is ITEM000067-10.2', ()=>{
  expect(isBarcodeValid('ITEM000067')).toStrictEqual(false );
})
it('should return true when barcode is ITEM000001-10.2', ()=>{
  expect(isBarcodeValid('ITEM000001')).toStrictEqual(true );
})

//splitTag
it('should return {"barcode": "ITEM000001", "count": 10.2} when barcode is ITEM000001-10.2', ()=>{
  expect(splitTag('ITEM000001-10.2')).toStrictEqual({"barcode": "ITEM000001", "count": 10.2} );
})


//dereplication
it('should return {"barcode": "ITEM000001", "count": 10.2} when barcode is ITEM000001-10.2', ()=>{
  expect(dereplication([{"barcode": "ITEM000001", "count": 10.2},{"barcode": "ITEM000001", "count": 10.4}])).toStrictEqual( [{"barcode": "ITEM000001", "count": 20.6}]);
})

//normalizeTag
it('should return {"barcode": "ITEM000001", "count": 10.2} when barcode is ITEM000001-10.2', ()=>{
  expect(normalizeTag(['ITEM000001-10.2','ITEM000001-10.4'])).toStrictEqual( [{"barcode": "ITEM000001", "count": 20.6}] );
})

//fillReceipt
it('should return {"barcode": "ITEM000001", "count": 10.2} when barcode is ITEM000001-10.2', ()=>{
  expect(fillReceipt([{"barcode": "ITEM000001", "count": 20.6}])).toStrictEqual([{"barcode": "ITEM000001", "count": 20.6, "name": "雪碧", "price": 3, "unit": "瓶"}]);
})

//calculateTolPrice

it('should return {"barcode": "ITEM000001", "count": 10.2} when barcode is ITEM000001-10.2', ()=>{
  expect(calculateTolPrice( [{"barcode": "ITEM000001", "count": 20.6, "name": "雪碧", "price": 3, "unit": "瓶"}])).toStrictEqual( {"allReceiptItems": [{"barcode": "ITEM000001", "count": 20.6, "name": "雪碧", "price": 3, "subTolPrice": 61.800000000000004, "unit": "瓶"}], "totalPrice": 61.800000000000004});
})

//calculateTotalDiscount
it('should return false when barcode is ITEM000001-10.2', ()=>{
  expect(calculateTotalDiscount({"allReceiptItems": [{"barcode": "ITEM000001", "count": 20.6, "name": "雪碧", "price": 3, "subTolPrice": 61.800000000000004, "unit": "瓶"}], "totalPrice": 61.800000000000004})).toStrictEqual(false );
})





