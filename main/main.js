'use strict';

const loadAllItems = require('../test/fixtures.js').loadAllItems
const isAllBarcodeValid=(tags) =>{
    for (let i = 0; i < tags.length; i++) {
        if (isBarcodeValid(tags[i].substr(0, 10)) === false) {
            return false;
        }
    }
    return true;
}

const isBarcodeValid = (tag) => {
    const allItems = loadAllItems();
    for (let i = 0; i < allItems.length; i++) {
        if (tag === allItems[i].barcode) {

            return true;
        }
    }
    return false;
};

const splitTag = (tag) => {
    let barcode = "";
    let count = 1;
    if (tag.indexOf('-') === -1) {
        barcode = tag;
    } else {
        let tmp = tag.split('-');
        barcode = tmp[0];
        count = Number(tmp[1]);
    }
    return {"barcode": barcode, "count": count};
};

const dereplication = (splitedTags) => {
    let map = new Map();
    for (let i = 0; i < splitedTags.length; i++) {

        let tmpStr = splitedTags[i].barcode;
        if (map.has(tmpStr)) {
            map.set(tmpStr, map.get(tmpStr) + splitedTags[i].count);
        } else {
            map.set(tmpStr, splitedTags[i].count);
        }
    }
    let dereplicatedTags = [];
    for (var [key, value] of map.entries()) {
        dereplicatedTags.push({"barcode": key, "count": value})
    }


    return dereplicatedTags;

};

const normalizedTag = (tags) => {
    let splitedTags = [];
    for (let i = 0; i < tags.length; i++) {
        splitedTags.push(splitTag(tags[i]));

    }

    return dereplication(splitedTags);
};

const getItemInfo = (barcode) => {
    const datasource = loadAllItems();
    for (let i = 0; i < datasource.length; i++) {
        if (barcode === datasource[i].barcode) {
            return datasource[i];
        }
    }
};

const fillReceipt = (normalizedTags) => {
    let allReceiptItems = normalizedTags;
    for (let i = 0; i < normalizedTags.length; i++) {
        let tmp = getItemInfo(normalizedTags[i].barcode);

        allReceiptItems[i].name = tmp.name;
        allReceiptItems[i].unit = tmp.unit;
        allReceiptItems[i].price = tmp.price;
    }
    return allReceiptItems;
};

const calculateSubPrice = (price, count) => {
    return price * count;
};

const calculateTolPrice = (allReceiptItems) => {
    let sum = 0;
    for (let i = 0; i < allReceiptItems.length; i++ ) {
        allReceiptItems[i].subTolPrice = calculateSubPrice(allReceiptItems[i].price, allReceiptItems[i].count);
        sum += allReceiptItems[i].subTolPrice;
    }
    return {"allReceiptItems":allReceiptItems,"totalPrice":sum};
};

const isDiscount = (barcode) => {
    let promotions = loadPromotions()[0].barcodes;
    for(let i = 0; i < promotions.length; i++) {
        if (barcode === promotions[i]){
            return true;
        }
    }
    return false;
};

const calcultateDiscount = (barcode, price, count) => {
    if (isDiscount(barcode)) {
        return count * price - Math.floor(count / 3) * price;
    }else {
        return price * count;
    }
};

const calculateTotalDiscount = (allReceiptData) => {
    let totalDiscount = 0;
    for (let i = 0; i < allReceiptData.length; i++) {
        allReceiptData[i].subTolPrice = calcultateDiscount(allReceiptData[i].barcode, allReceiptData[i], price, allReceiptData.count);
        totalDiscount += allReceiptData[i].subTolPrice;
    }
    return allReceiptData.totalReducedPrice = allReceiptData.totalPrice - totalDiscount;
};

const generateReceiptData = (tags) => {
    console.log(calculateTotalDiscount(calculateTolPrice(fillReceipt(normalizedTag(tags)))));
    return calculateTotalDiscount(calculateTolPrice(fillReceipt(normalizedTag(tags))));
};

module.exports = {
    //printReceipt: printReceipt,
    isAllBarcodeValid: isAllBarcodeValid,
    isBarcodeValid: isBarcodeValid,
    splitTag: splitTag,
    dereplication: dereplication,
    normalizedTag:normalizedTag,
    getItemInfo: getItemInfo,
    fillReceipt:fillReceipt,
    calculateSubPrice:calculateSubPrice,
    calculateTolPrice:calculateTolPrice,
    generateReceiptData:generateReceiptData,
};
